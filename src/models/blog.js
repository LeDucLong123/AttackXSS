const mongoose = require("mongoose");

// Schema cho Blog Post
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tiêu đề là bắt buộc"],
      trim: true,
      minlength: [1, "Tiêu đề không được để trống"],
      maxlength: [200, "Tiêu đề không được quá 200 ký tự"],
    },
    content: {
      type: String,
      required: [true, "Nội dung là bắt buộc"],
      trim: true,
      minlength: [1, "Nội dung không được để trống"],
      maxlength: [5000, "Nội dung không được quá 5000 ký tự"],
    },
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      account: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["published", "draft", "deleted"],
      default: "published",
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: 50,
      },
    ],
  },
  {
    timestamps: true, // Tự động tạo createdAt và updatedAt
  }
);

// Index để tìm kiếm nhanh
blogSchema.index({ title: "text", content: "text" });
blogSchema.index({ "author.id": 1 });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ status: 1 });

// Static methods
blogSchema.statics.findPublished = function () {
  return this.find({ status: "published" }).sort({ createdAt: -1 });
};

blogSchema.statics.findByAuthor = function (authorId) {
  return this.find({
    "author.id": authorId,
    status: "published",
  }).sort({ createdAt: -1 });
};

blogSchema.statics.search = function (keyword) {
  return this.find({
    $and: [
      { status: "published" },
      {
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { content: { $regex: keyword, $options: "i" } },
          { tags: { $in: [new RegExp(keyword, "i")] } },
        ],
      },
    ],
  }).sort({ createdAt: -1 });
};

blogSchema.statics.getStats = async function () {
  const stats = await this.aggregate([
    { $match: { status: "published" } },
    {
      $group: {
        _id: null,
        totalPosts: { $sum: 1 },
        totalViews: { $sum: "$views" },
        authors: { $addToSet: "$author.id" },
      },
    },
    {
      $project: {
        _id: 0,
        totalPosts: 1,
        totalViews: 1,
        totalUsers: { $size: "$authors" },
      },
    },
  ]);

  return stats[0] || { totalPosts: 0, totalViews: 0, totalUsers: 0 };
};

// Instance methods
blogSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

blogSchema.methods.isAuthor = function (userId) {
  return this.author.id.toString() === userId.toString();
};

// Virtual để format thời gian
blogSchema.virtual("timeAgo").get(function () {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  return this.createdAt.toLocaleDateString("vi-VN");
});

// Đảm bảo virtual được bao gồm khi convert sang JSON
blogSchema.set("toJSON", { virtuals: true });

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
