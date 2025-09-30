const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Schema cho User
const userSchema = new mongoose.Schema(
  {
    account: {
      type: String,
      required: [true, "Tài khoản là bắt buộc"],
      unique: true,
      trim: true,
      minlength: [3, "Tài khoản phải có ít nhất 3 ký tự"],
      maxlength: [50, "Tài khoản không được quá 50 ký tự"],
    },
    name: {
      type: String,
      required: [true, "Tên là bắt buộc"],
      trim: true,
      minlength: [2, "Tên phải có ít nhất 2 ký tự"],
      maxlength: [100, "Tên không được quá 100 ký tự"],
    },
    password: {
      type: String,
      required: [true, "Mật khẩu là bắt buộc"],
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
    },
  },
  {
    timestamps: true, // Tự động tạo createdAt và updatedAt
  }
);

// Schema cho Session
const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionToken: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày
    },
  },
  {
    timestamps: true,
  }
);

// Index để tự động xóa session hết hạn
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Middleware hash password trước khi save
userSchema.pre("save", async function (next) {
  // Chỉ hash password nếu nó được thay đổi
  if (!this.isModified("password")) return next();

  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Method để kiểm tra password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method để tạo session token
userSchema.methods.createSession = async function () {
  const crypto = require("crypto");
  const sessionToken = crypto.randomBytes(32).toString("hex");

  const session = new Session({
    userId: this._id,
    sessionToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày
  });

  await session.save();
  return session;
};

// Method để xóa tất cả session của user
userSchema.methods.clearSessions = async function () {
  await Session.deleteMany({ userId: this._id });
};

// Static method để tìm user bằng session token
userSchema.statics.findBySessionToken = async function (token) {
  const session = await Session.findOne({
    sessionToken: token,
    expiresAt: { $gt: new Date() },
  }).populate("userId");

  return session ? session.userId : null;
};

// Loại bỏ password khi convert sang JSON
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Tạo models
const User = mongoose.model("User", userSchema);
const Session = mongoose.model("Session", sessionSchema);

module.exports = { User, Session };
