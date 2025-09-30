// Script cho blog homepage
document.addEventListener("DOMContentLoaded", function () {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Add animation to cards on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe all blog cards
  document.querySelectorAll(".blog-card").forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(card);
  });

  // Add typing effect to hero title (optional)
  const heroTitle = document.querySelector(".hero-section h1");
  if (
    heroTitle &&
    !heroTitle.innerHTML.includes('<span class="text-warning">')
  ) {
    const text = heroTitle.textContent;
    heroTitle.innerHTML = "";
    let i = 0;

    function typeWriter() {
      if (i < text.length) {
        heroTitle.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      }
    }

    setTimeout(typeWriter, 500);
  }

  // Form validation for test modal
  const testForm = document.querySelector("#testModal form");
  if (testForm) {
    testForm.addEventListener("submit", function (e) {
      const nameInput = this.querySelector("#name");
      if (nameInput.value.trim().length < 2) {
        e.preventDefault();
        alert("Vui lòng nhập tên có ít nhất 2 ký tự!");
        nameInput.focus();
        return false;
      }
    });
  }

  // Add loading spinner for form submission
  const submitBtn = document.querySelector('#testModal button[type="submit"]');
  if (submitBtn) {
    submitBtn.addEventListener("click", function () {
      const icon = this.querySelector("i");
      if (icon) {
        icon.className = "fas fa-spinner fa-spin me-2";
      }
      this.disabled = true;

      setTimeout(() => {
        this.disabled = false;
        if (icon) {
          icon.className = "fas fa-paper-plane me-2";
        }
      }, 2000);
    });
  }

  // Add hover effects to stats
  document.querySelectorAll(".bg-light .card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05)";
      this.style.transition = "transform 0.3s ease";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  });

  console.log("Blog homepage loaded successfully! 🎉");
});
