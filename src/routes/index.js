const express = require("express");
const router = express.Router();

const home = require("./home.js");
const blog = require("./blog.js");
const auth = require("./auth.js");

router.use("/", home);
router.use("/blog", blog);
router.use("/auth", auth);

// Test logout route
router.get("/test-logout", (req, res) => {
  res.render("test-logout", { user: req.user });
});

// Test create post route
router.get("/test-create-post", (req, res) => {
  res.render("test-create-post");
});
module.exports = router;
