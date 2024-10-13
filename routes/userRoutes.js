const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  changePassword,
  getBorrowedBooks,
  getAllBorrowedBooks,
  getNotifications,
  resetNotifications,
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

router.get("/borrowed-books", authMiddleware, getBorrowedBooks);

router.get("/all-borrowed-books", authMiddleware, getAllBorrowedBooks);

router.get("/notifications", authMiddleware, getNotifications);

router.post("/reset-notifications", authMiddleware, resetNotifications);

module.exports = router;
