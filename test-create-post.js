// Test tạo bài viết qua API
async function testCreatePost() {
  try {
    // Đầu tiên đăng nhập để lấy session
    console.log("🔐 Logging in...");
    const loginResponse = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account: "testuser",
        password: "password123",
      }),
    });

    const loginData = await loginResponse.json();
    console.log("Login result:", loginData);

    if (!loginData.success) {
      console.error("❌ Login failed:", loginData.message);
      return;
    }

    // Lấy cookie từ response
    const cookies = loginResponse.headers.get("set-cookie");
    console.log("🍪 Cookies:", cookies);

    // Tạo bài viết mới
    console.log("📝 Creating new post...");
    const postResponse = await fetch("http://localhost:3000/blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies || "",
      },
      body: JSON.stringify({
        title: "Bài viết test từ API",
        content: "Đây là bài viết được tạo từ API để test chức năng tạo blog.",
      }),
    });

    const postData = await postResponse.json();
    console.log("Create post result:", postData);

    if (postData.success) {
      console.log("✅ Post created successfully!");
    } else {
      console.error("❌ Failed to create post:", postData.message);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Chạy test nếu file được chạy trực tiếp
if (typeof window === "undefined") {
  // Node.js environment
  const fetch = require("node-fetch");
  testCreatePost();
} else {
  // Browser environment
  window.testCreatePost = testCreatePost;
}
