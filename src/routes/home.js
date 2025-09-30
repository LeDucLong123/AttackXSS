const express = require("express");
const router = express.Router();

const home = require("../controllers/home.js");

router.get("/", home.index);
router.post("/test", home.test);

module.exports = router;
