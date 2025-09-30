const mongoose = require("mongoose");
const Blog = require("./src/models/blog");
const { User } = require("./src/models/users");

async function resetAndCreateSampleData() {
  try {
    // Kết nối MongoDB
    await mongoose.connect("mongodb://localhost:27017/myblog");
    console.log("✅ Connected to MongoDB");

    // Xóa tất cả bài viết cũ
    await Blog.deleteMany({});
    console.log("🗑️ Cleared all existing posts");

    // Tạo user test nếu chưa có
    let testUser = await User.findOne({ account: "testuser" });
    if (!testUser) {
      testUser = new User({
        account: "testuser",
        name: "Test User",
        password: "password123",
      });
      await testUser.save();
      console.log("👤 Created test user");
    }

    // Tạo một số bài viết mẫu
    const samplePosts = [
      {
        title: "Chào mừng đến với Blog Community!",
        content:
          "Đây là bài viết đầu tiên trên blog community của chúng ta. Hãy cùng nhau chia sẻ những câu chuyện thú vị nhé!",
        author: {
          id: testUser._id,
          name: testUser.name,
          account: testUser.account,
        },
      },
      {
        title: "Chia sẻ kinh nghiệm học lập trình",
        content:
          "Sau 2 năm học lập trình, mình muốn chia sẻ một số kinh nghiệm:\n\n1. Thực hành nhiều hơn lý thuyết\n2. Đừng ngại hỏi khi gặp khó khăn\n3. Tham gia các dự án thực tế\n4. Học cách đọc documentation\n5. Kiên trì và không bỏ cuộc",
        author: {
          id: testUser._id,
          name: testUser.name,
          account: testUser.account,
        },
      },
    ];

    for (const postData of samplePosts) {
      const post = new Blog(postData);
      await post.save();
      console.log(`📝 Created post: ${post.title}`);
    }

    // Lấy tất cả posts để verify
    const allPosts = await Blog.findPublished();
    console.log(`📊 Total posts in database: ${allPosts.length}`);

    allPosts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title} - by ${post.author.name}`);
    });

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
    console.log("🎉 Sample data created successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

resetAndCreateSampleData();
