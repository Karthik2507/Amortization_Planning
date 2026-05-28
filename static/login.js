function showToast(type, title, message) {
  const toastContainer = document.getElementById("toastContainer");

  const toast = document.createElement("div");

  toast.className = `toast ${type}`;

  let icon = "fa-circle-check";

  if (type === "error") {
    icon = "fa-circle-xmark";
  }

  if (type === "warning") {
    icon = "fa-triangle-exclamation";
  }

  toast.innerHTML = `
  
    <div class="toast-icon">
      <i class="fa-solid ${icon}"></i>
    </div>

    <div class="toast-content">

      <div class="toast-title">
        ${title}
      </div>

      <div class="toast-message">
        ${message}
      </div>

    </div>

    <button class="toast-close">
      <i class="fa-solid fa-xmark"></i>
    </button>

    <div class="toast-progress"></div>
  
  `;

  toastContainer.appendChild(toast);

  toast.querySelector(".toast-close").addEventListener("click", () => {
    toast.style.animation = "slideOut .4s ease forwards";

    setTimeout(() => {
      toast.remove();
    }, 400);
  });

  setTimeout(() => {
    toast.style.animation = "slideOut .4s ease forwards";

    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 400);
  }, 4000);
}

async function login() {
  const loginBtn = document.getElementById("loginBtn");

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email) {
    showToast("error", "Email Required", "Please enter your email address.");
    return;
  }

  if (!password) {
    showToast("error", "Password Required", "Please enter your password.");
    return;
  }

  // START LOADING
  loginBtn.classList.add("loading");
  loginBtn.disabled = true;

  try {
    const response = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      showToast("success", "Login Successful", "Redirecting to dashboard...");

      localStorage.setItem("user", JSON.stringify(data));

      // optional small delay ONLY for UX
      await new Promise((r) => setTimeout(r, 800));
      window.location.href = "/dashboard";
    } else {
      showToast("error", "Login Failed", data.message || "Invalid credentials");

      // ❗ IMPORTANT: STOP LOADING ON ERROR
      loginBtn.classList.remove("loading");
      loginBtn.disabled = false;
    }
  } catch (error) {
    showToast("error", "Server Error", "Please try again later.");

    loginBtn.classList.remove("loading");
    loginBtn.disabled = false;
  }
}
