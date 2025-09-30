const Blog = require("../models/blog");

async function index(req, res) {
  try {
    // Lấy tất cả bài viết từ database
    const posts = await Blog.findPublished();
    const stats = await Blog.getStats();

    res.render("blog", {
      posts,
      stats,
      user: req.user,
    });
  } catch (error) {
    console.error("Blog index error:", error);
    res.render("blog", {
      posts: [],
      stats: { totalPosts: 0, totalUsers: 0, totalViews: 0 },
      user: req.user,
    });
  }
}

async function create(req, res) {
  try {
    // Kiểm tra đăng nhập
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Bạn cần đăng nhập để đăng bài!",
      });
    }

    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ tiêu đề và nội dung!",
      });
    }

    // Tạo bài viết mới
    const newPost = new Blog({
      title,
      content,
      author: {
        id: req.user._id,
        name: req.user.name,
        account: req.user.account,
      },
    });

    await newPost.save();

    res.json({
      success: true,
      message: "Bài viết đã được đăng thành công!",
      post: {
        id: newPost._id,
        title: newPost.title,
        content: newPost.content,
        author: newPost.author,
        timeAgo: newPost.timeAgo,
        createdAt: newPost.createdAt,
      },
    });
  } catch (error) {
    console.error("Create post error:", error);

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
      message: "Có lỗi xảy ra khi đăng bài!",
    });
  }
}

function show(req, res) {
  const { id } = req.params;

  // Sample blog post data - sau này có thể lấy từ database
  const blogPosts = {
    1: {
      id: 1,
      title: "Hướng dẫn Node.js cho người mới bắt đầu",
      category: "Lập trình",
      content: `
        <h3>Giới thiệu về Node.js</h3>
        <p>Node.js là một runtime environment cho JavaScript được xây dựng trên V8 JavaScript engine của Chrome. Nó cho phép chạy JavaScript ở phía server, mở ra nhiều khả năng mới cho việc phát triển ứng dụng web.</p>
        
        <h3>Cài đặt Node.js</h3>
        <p>Để cài đặt Node.js, bạn có thể tải về từ trang web chính thức hoặc sử dụng package manager như npm:</p>
        <pre><code>
# Kiểm tra version
node --version
npm --version

# Tạo project mới
npm init -y
        </code></pre>
        
        <h3>Tạo server đầu tiên</h3>
        <p>Sau đây là cách tạo một server HTTP đơn giản với Node.js:</p>
        <pre><code>
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(\`Server running at http://localhost:\${port}\`);
});
        </code></pre>
        
        <h3>Kết luận</h3>
        <p>Node.js là một công cụ mạnh mẽ cho việc phát triển ứng dụng web. Với cộng đồng lớn và hệ sinh thái npm phong phú, Node.js sẽ giúp bạn xây dựng những ứng dụng tuyệt vời.</p>
      `,
      author: "Admin",
      date: "25/09/2025",
      views: 1234,
      comments: 15,
      tags: ["Node.js", "JavaScript", "Backend", "Tutorial"],
    },
    2: {
      id: 2,
      title: "Tìm hiểu về XSS Attack và cách phòng chống",
      category: "Bảo mật",
      content: `
        <h3>XSS là gì?</h3>
        <p>Cross-Site Scripting (XSS) là một lỗ hổng bảo mật web cho phép kẻ tấn công chèn script độc hại vào các trang web được tin cậy. Khi người dùng truy cập trang web, script này sẽ được thực thi trên trình duyệt của họ.</p>
        
        <h3>Các loại XSS</h3>
        <ul>
          <li><strong>Reflected XSS:</strong> Script độc hại được phản ánh ngay lập tức từ server</li>
          <li><strong>Stored XSS:</strong> Script được lưu trữ trên server và thực thi khi người dùng truy cập</li>
          <li><strong>DOM-based XSS:</strong> Lỗ hổng xảy ra ở phía client trong DOM</li>
        </ul>
        
        <h3>Cách phòng chống</h3>
        <p>Để bảo vệ ứng dụng khỏi XSS, bạn cần:</p>
        <ol>
          <li>Validate và sanitize tất cả input từ người dùng</li>
          <li>Encode output khi hiển thị dữ liệu</li>
          <li>Sử dụng Content Security Policy (CSP)</li>
          <li>Sử dụng thư viện bảo mật như DOMPurify</li>
        </ol>
        
        <pre><code>
// Ví dụ sanitize input với express-validator
const { body, validationResult } = require('express-validator');

app.post('/comment', [
  body('comment').escape().trim().isLength({ min: 1 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Xử lý comment đã được sanitize
});
        </code></pre>
      `,
      author: "Admin",
      date: "20/09/2025",
      views: 987,
      comments: 8,
      tags: ["Security", "XSS", "Web Security", "JavaScript"],
    },
    3: {
      id: 3,
      title: "MongoDB vs MySQL: So sánh chi tiết",
      category: "Database",
      content: `
        <h3>Giới thiệu</h3>
        <p>Việc chọn database phù hợp là một quyết định quan trọng trong việc phát triển ứng dụng. MongoDB và MySQL là hai lựa chọn phổ biến, mỗi loại có ưu nhược điểm riêng.</p>
        
        <h3>MongoDB - NoSQL Database</h3>
        <h4>Ưu điểm:</h4>
        <ul>
          <li>Linh hoạt trong cấu trúc dữ liệu (schema-less)</li>
          <li>Hiệu năng cao với dữ liệu lớn</li>
          <li>Dễ dàng scale horizontally</li>
          <li>Hỗ trợ JSON native</li>
        </ul>
        
        <h4>Nhược điểm:</h4>
        <ul>
          <li>Không hỗ trợ ACID transactions hoàn toàn</li>
          <li>Sử dụng nhiều memory hơn</li>
          <li>Khó học nếu quen với SQL</li>
        </ul>
        
        <h3>MySQL - Relational Database</h3>
        <h4>Ưu điểm:</h4>
        <ul>
          <li>ACID compliance đầy đủ</li>
          <li>Mature và stable</li>
          <li>Hỗ trợ SQL standard</li>
          <li>Nhiều tools và resources</li>
        </ul>
        
        <h4>Nhược điểm:</h4>
        <ul>
          <li>Cấu trúc cố định (rigid schema)</li>
          <li>Khó scale horizontally</li>
          <li>Hiệu năng giảm với dữ liệu rất lớn</li>
        </ul>
        
        <h3>Khi nào dùng gì?</h3>
        <p><strong>Chọn MongoDB khi:</strong></p>
        <ul>
          <li>Dữ liệu không có cấu trúc cố định</li>
          <li>Cần scale nhanh và lớn</li>
          <li>Làm việc với JSON/JavaScript</li>
          <li>Prototype và phát triển nhanh</li>
        </ul>
        
        <p><strong>Chọn MySQL khi:</strong></p>
        <ul>
          <li>Cần ACID transactions nghiêm ngặt</li>
          <li>Dữ liệu có cấu trúc rõ ràng</li>
          <li>Team quen với SQL</li>
          <li>Ứng dụng tài chính, banking</li>
        </ul>
      `,
      author: "Admin",
      date: "15/09/2025",
      views: 756,
      comments: 12,
      tags: ["MongoDB", "MySQL", "Database", "Comparison"],
    },
  };

  const post = blogPosts[id];

  if (!post) {
    return res.status(404).render("404", { message: "Bài viết không tồn tại" });
  }

  res.render("blog-detail", { post });
}

module.exports = { index, create, show };
