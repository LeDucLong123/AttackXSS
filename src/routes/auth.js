const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

// GET /auth - Hiển thị trang đăng nhập/đăng ký
router.get("/", authController.showAuthPage);

// POST /auth/register - Đăng ký
router.post("/register", authController.register);

// POST /auth/login - Đăng nhập
router.post("/login", authController.login);

// POST /auth/logout - Đăng xuất
router.post("/logout", authController.logout);

module.exports = router;
