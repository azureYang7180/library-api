const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");

// 注册新用户
router.post("/register", registerUser);

// 用户登录
router.post("/login", loginUser);

module.exports = router;
