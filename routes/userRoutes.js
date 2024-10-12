const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  changePassword,
} = require("../controllers/userController");
const { uploadAvatar } = require("../controllers/uploadAvatarController");
const authMiddleware = require("../middleware/authMiddleware");

// 注册新用户
router.post("/register", registerUser);

// 用户登录
router.post("/login", loginUser);

// 用户更新密码
router.post("/change-password", authMiddleware, changePassword);

// 上传头像
router.post("/upload-avatar", authMiddleware, uploadAvatar);

router.get("/profile", authMiddleware, getProfile);

module.exports = router;
