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

async function signup() {
  const name = document.getElementById("name").value.trim();

  const email = document.getElementById("email").value.trim();

  const emprole = document.getElementById("emprole").value.trim();

  const password = document.getElementById("password").value.trim();

  const confirm = document.getElementById("confirm").value.trim();

  // EMPTY VALIDATION
  if (!name) {
    showToast("error", "Name Required", "Please enter your full name.");
    return;
  }

  if (!email) {
    alert("Email is required");
    showToast("error", "Email Required", "Please enter your Email.");
    return;
  }

  if (!emprole) {
    showToast(
      "error",
      "Employee role Required",
      "Please enter your Employee role.",
    );
    return;
  }

  if (!password) {
    showToast("error", "Password is Required", "Please enter your password");
    return;
  }

  if (!confirm) {
    showToast(
      "error",
      "confirm password Required",
      "Please retype your password in confirm password field",
    );
    return;
  }

  // PASSWORD LENGTH
  if (password.length < 8) {
    showToast(
      "warning",
      "Weak Password",
      "Password must be at least 8 characters.",
    );

    return;
  }

  // PASSWORD MATCH
  if (password !== confirm) {
    showToast("error", "Password Mismatch", "Passwords do not match.");

    return;
  }

  const response = await fetch("http://127.0.0.1:5000/signup", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      name,
      email,
      password,
      EmpRole: emprole,
    }),
  });

  const data = await response.json();

  if (data.success) {
    showToast("success", "Account Created", data.message);

    setTimeout(() => {
      window.location.href = "/";
    }, 1800);
  } else {
    showToast("error", "Signup Failed", data.message);
  }
}
