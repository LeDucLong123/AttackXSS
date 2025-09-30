const mongoose = require("mongoose");
const Blog = require("./src/models/blog");

async function testDatabase() {
  try {
    // Kết nối MongoDB
    await mongoose.connect("mongodb://localhost:27017/myblog");
    console.log("✅ Connected to MongoDB");

    // Tạo test blog post
    const testPost = new Blog({
      title: "Test Blog Post",
      content: "Đây là bài viết test để kiểm tra database",
      author: {
        id: new mongoose.Types.ObjectId(),
        name: "Test User",
        account: "testuser",
      },
    });

    await testPost.save();
    console.log("✅ Test post created:", testPost.title);

    // Lấy tất cả posts
    const posts = await Blog.find();
    console.log("📊 Total posts in database:", posts.length);

    // Hiển thị các posts
    posts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title} - by ${post.author.name}`);
    });

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testDatabase();
