// Initialize Firebase
document.addEventListener("DOMContentLoaded", function () {
  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyC_QbRlg1PZNoSSjTAfUPpdSLJSVIdRZrs",
    authDomain: "levkis-studio-ac5a1.firebaseapp.com",
    projectId: "levkis-studio-ac5a1",
    storageBucket: "levkis-studio-ac5a1.firebasestorage.app",
    messagingSenderId: "328920228151",
    appId: "1:328920228151:web:4d23dc1243de5bc8807ab2",
    measurementId: "G-PJ82L60HCX",
  };

  // Initialize Firebase if it's available
  let firebase; // Declare firebase variable
  if (typeof firebase !== "undefined") {
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
  }

  // Set current year in footer
  document.getElementById("currentYear").textContent = new Date().getFullYear();

  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      this.classList.toggle("active");
      navLinks.classList.toggle("active");
    });
  }

  // Close mobile menu when clicking on a link
  const navLinksItems = document.querySelectorAll(".nav-links a");
  navLinksItems.forEach((item) => {
    item.addEventListener("click", function () {
      if (mobileMenuBtn && mobileMenuBtn.classList.contains("active")) {
        mobileMenuBtn.classList.remove("active");
        navLinks.classList.remove("active");
      }
    });
  });

  // Header scroll effect
  const header = document.querySelector("header");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      header.style.padding = "10px 0";
      header.style.backgroundColor = "rgba(46, 16, 101, 0.98)";
    } else {
      header.style.padding = "20px 0";
      header.style.backgroundColor = "rgba(46, 16, 101, 0.95)";
    }
  });

  // Form submission
  const orderForm = document.getElementById("orderForm");

  if (orderForm) {
    orderForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = {
        fullName: document.getElementById("fullName").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        telegram: document.getElementById("telegram").value,
        serviceType: document.querySelector('input[name="serviceType"]:checked')
          .value,
        message: document.getElementById("message").value,
      };

      // Disable submit button
      const submitBtn = orderForm.querySelector(".btn-submit");
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Відправка...';

      // Format service type
      let serviceTypeText = "";
      if (formData.serviceType === "website") {
        serviceTypeText = "Веб-сайт";
      } else if (formData.serviceType === "telegram-bot") {
        serviceTypeText = "Telegram бот";
      } else {
        serviceTypeText = "Інше";
      }

      // Create message text
      const messageText = `
🔔 Нове замовлення!

👤 ПІБ: ${formData.fullName}
📱 Телефон: ${formData.phone}
📧 Email: ${formData.email}
💬 Telegram: @${formData.telegram}
🛠️ Послуга: ${serviceTypeText}

📝 Повідомлення:
${formData.message || "Не вказано"}
            `;

      // Send to Telegram
      sendToTelegram(messageText)
        .then((response) => {
          if (response.ok) {
            showToast(
              "Замовлення відправлено!",
              "Ми зв'яжемося з вами найближчим часом.",
              "success"
            );
            orderForm.reset();
          } else {
            throw new Error("Помилка відправки в Telegram");
          }
        })
        .catch((error) => {
          console.error("Error:", error);

          // Fallback to email
          const emailSubject = "Нове замовлення з сайту Levkis Studio";
          const mailtoLink = `mailto:info@levkisstudio.com?subject=${encodeURIComponent(
            emailSubject
          )}&body=${encodeURIComponent(messageText)}`;

          window.open(mailtoLink, "_blank");

          showToast(
            "Увага!",
            "Не вдалося відправити через Telegram. Відкрито поштовий клієнт.",
            "error"
          );
        })
        .finally(() => {
          // Re-enable submit button
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        });
    });
  }
});

// Toast notification function
function showToast(title, message, type = "success") {
  const toast = document.getElementById("toast");
  const toastTitle = document.getElementById("toastTitle");
  const toastText = document.getElementById("toastText");
  const toastIcon = document.getElementById("toastIcon");

  // Set content
  toastTitle.textContent = title;
  toastText.textContent = message;

  // Set icon
  if (type === "success") {
    toastIcon.className = "fas fa-check-circle success";
  } else {
    toastIcon.className = "fas fa-exclamation-circle error";
  }

  // Show toast
  toast.classList.add("show");

  // Hide toast after 5 seconds
  setTimeout(function () {
    toast.classList.remove("show");
  }, 5000);
}

// Function to send data to Telegram
function sendToTelegram(message) {
  // Використовуємо змінні середовища, додані до проекту Vercel
  const BOT_TOKEN = "8110848342:AAH4jPG_4DrLImuKM_VJQf5Lx3S3XVbNsaw"; // Використовуємо змінну середовища
  const CHAT_ID = "5542983364"; // Використовуємо змінну середовища

  // Використовуємо API Telegram напряму
  const telegramApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  return fetch(telegramApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "HTML",
    }),
  });
}
