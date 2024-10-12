const multer = require("multer");
const path = require("path");
const User = require("../models/userModel");

// 设置存储路径
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/avatars/"); // 将头像文件存储到 uploads/avatars 文件夹
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // 使用时间戳命名文件
  },
});

// 头像上传限制
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 }, // 限制文件大小为1MB
}).single("avatar"); // 接收单个头像文件

// 上传头像的控制器
const uploadAvatar = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "Error uploading file" });
    }

    try {
      const user = await User.findById(req.user.id); // 获取当前用户信息
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // 保存头像路径
      user.avatar = `/uploads/avatars/${req.file.filename}`;
      await user.save();

      res.json({
        message: "Avatar uploaded successfully",
        avatar: user.avatar,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

module.exports = { uploadAvatar };
