const express = require("express");
const cookieParser = require("cookie-parser");
const { connect } = require("./config/db");
const app = express();
const path = require("path");
const port = 3000;

connect();

const router = require("./routes/index.js");
const authController = require("./controllers/auth");

//Config
app.set("view engine", "ejs"); // bật ejs
app.set("views", path.join(__dirname, "views")); // thư mục views
app.use(express.urlencoded({ extended: true })); // parse form
app.use(express.json());
app.use(cookieParser()); // parse cookies
app.use(express.static(path.join(__dirname, "..", "public"))); // tĩnh

// Áp dụng middleware xác thực cho tất cả routes
app.use(authController.authenticate);

app.use(router);

// Start server
app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`);
});
