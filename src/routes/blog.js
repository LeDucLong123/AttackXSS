const express = require("express");
const router = express.Router();

const blog = require("../controllers/blog.js");
const authController = require("../controllers/auth");

// Áp dụng middleware xác thực cho tất cả routes
router.use(authController.authenticate);

router.get("/", blog.index);
router.post("/", authController.requireAuth, blog.create);
router.get("/:id", blog.show);

module.exports = router;
