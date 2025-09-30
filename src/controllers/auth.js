const { User, Session } = require("../models/users");

const authController = {
  // Hiển thị trang đăng nhập/đăng ký
  showAuthPage: (req, res) => {
    // Kiểm tra nếu đã đăng nhập thì redirect về blog
    if (req.user) {
      return res.redirect("/blog");
    }
    res.render("auth");
  },

  // API đăng ký
  register: async (req, res) => {
    try {
      const { account, name, password, confirmPassword } = req.body;

      // Validation
      if (!account || !name || !password || !confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng điền đầy đủ thông tin!",
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Mật khẩu xác nhận không khớp!",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Mật khẩu phải có ít nhất 6 ký tự!",
        });
      }

      // Kiểm tra tài khoản đã tồn tại
      const existingUser = await User.findOne({ account });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Tài khoản đã tồn tại!",
        });
      }

      // Tạo user mới
      const newUser = new User({ account, name, password });
      await newUser.save();

      res.json({
        success: true,
        message: "Đăng ký thành công!",
        user: {
          id: newUser._id,
          account: newUser.account,
          name: newUser.name,
        },
      });
    } catch (error) {
      console.error("Register error:", error);

      // Xử lý validation errors từ Mongoose
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({
          success: false,
          message: messages[0] || "Dữ liệu không hợp lệ!",
        });
      }

      res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra khi đăng ký!",
      });
    }
  },

  // API đăng nhập
  login: async (req, res) => {
    try {
      const { account, password } = req.body;

      if (!account || !password) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng điền đầy đủ thông tin!",
        });
      }

      // Tìm user theo account
      const user = await User.findOne({ account });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Tài khoản hoặc mật khẩu không đúng!",
        });
      }

      // Kiểm tra password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Tài khoản hoặc mật khẩu không đúng!",
        });
      }

      // Tạo session
      const session = await user.createSession();

      // Set cookie
      res.cookie("sessionToken", session.sessionToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        sameSite: "strict",
      });

      res.json({
        success: true,
        message: "Đăng nhập thành công!",
        user: {
          id: user._id,
          account: user.account,
          name: user.name,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra khi đăng nhập!",
      });
    }
  },

  // API đăng xuất
  logout: async (req, res) => {
    try {
      const sessionToken = req.cookies.sessionToken;

      if (sessionToken) {
        await Session.deleteOne({ sessionToken });
      }

      res.clearCookie("sessionToken");

      res.json({
        success: true,
        message: "Đăng xuất thành công!",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra khi đăng xuất!",
      });
    }
  },

  // Middleware xác thực
  authenticate: async (req, res, next) => {
    try {
      const sessionToken = req.cookies.sessionToken;

      if (!sessionToken) {
        req.user = null;
        return next();
      }

      const user = await User.findBySessionToken(sessionToken);
      req.user = user;

      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      req.user = null;
      next();
    }
  },

  // Middleware yêu cầu đăng nhập
  requireAuth: (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Bạn cần đăng nhập để thực hiện hành động này!",
      });
    }
    next();
  },

  // Middleware yêu cầu đăng nhập cho trang web
  requireAuthPage: (req, res, next) => {
    if (!req.user) {
      return res.redirect("/auth");
    }
    next();
  },
};

module.exports = authController;
