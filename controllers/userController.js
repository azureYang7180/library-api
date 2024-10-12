const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 创建JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // 令牌的有效期
  });
};

// 注册用户
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 用户登录
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 更新密码
const changePassword = async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.user.id;

  try {
    // 生成新的加密密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 更新用户的密码
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // 不返回密码字段
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      username: user.username,
      email: user.email,
      avatar: user.avatar, // 返回头像路径
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBorrowedBooks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "borrowHistory.bookId"
    );
    const borrowedBooks = user.borrowHistory.filter(
      (entry) => entry.status === "borrowed"
    );
    res.json(borrowedBooks.map((entry) => entry.bookId));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch borrowed books" });
  }
};
module.exports = {
  registerUser,
  loginUser,
  changePassword,
  getProfile,
  getBorrowedBooks,
};
