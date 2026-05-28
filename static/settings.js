const user = JSON.parse(
  localStorage.getItem("user")
);

// LOAD USER DATA
document.getElementById("fullName").value =
  user.name;

document.getElementById("emailAddress").value =
  user.email;

document.getElementById("roleOrg").value =
  user.EmpRole;

document.getElementById("topUserId").innerText =
  user.userid;


// SAVE CHANGES
async function saveChanges() {

  const fullName =
    document.getElementById("fullName").value.trim();

  const email =
    document.getElementById("emailAddress").value.trim();

  const roleOrg =
    document.getElementById("roleOrg").value.trim();

  // VALIDATION
  if (!fullName || !email || !roleOrg) {

    showToast(
      "error",
      "All fields are required",
      "Please fill in all fields before saving."
    );

    return;
  }

  try {

    const response = await fetch(
      "http://127.0.0.1:5000/update-user",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          userid: user.userid,
          name: fullName,
          email: email,
          EmpRole: roleOrg
        })
      }
    );

    const data = await response.json();

    if (data.success) {

      showToast(
        "success",
        "Changes Saved",
        "Your profile was updated successfully."
      );

      // UPDATE LOCAL STORAGE
      user.name = fullName;
      user.email = email;
      user.EmpRole = roleOrg;

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

    } else {

      showToast(
        "error",
        "Update Failed",
        "Unable to update your profile."
      );

    }

  } catch (error) {

    console.error(error);

    showToast(
      "error",
      "Server Error",
      "Something went wrong while saving changes."
    );

  }

}

// CHANGE PASSWORD
async function changePassword() {

  const currentPassword =
    document.getElementById("currentPassword").value.trim();

  const newPassword =
    document.getElementById("newPassword").value.trim();


  if (!currentPassword || !newPassword) {
    showToast(
  "error",
  "Missing Fields",
  "Fill all password fields"
);
    return;
  }

  if (newPassword.length < 8) {
    showToast(
  "warning",
  "Weak Password",
  "Password must be at least 8 characters"
);
    return;
  }


  const response = await fetch("http://127.0.0.1:5000/change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userid: user.userid,
      currentPassword,
      newPassword
    })
  });

  const data = await response.json();

  if (data.success) {

    showToast(
  "success",
  "Password Updated",
  "Password changed successfully. Logging out..."
);

    // ❗ FORCE LOGOUT IMMEDIATELY (NO WAIT)
    localStorage.clear();

    // prevent back navigation
    window.location.replace("/login");

  } else {
    showToast(
  "error",
  "Password Change Failed",
  data.message || "Error changing password"
);
  }
}


// DELETE ACCOUNT
async function deleteAccount(){

  const confirmDelete = confirm(
    "Are you sure you want to deactivate your account?"
  );

  if(!confirmDelete) return;


  const response = await fetch(
    "http://127.0.0.1:5000/delete-user",
    {
      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({
        userid:user.userid
      })
    }
  );

  const data = await response.json();

  if(data.success){

    localStorage.clear();

    window.location.href =
      "/login";

  }

}


// LOGOUT
function logout(){

  localStorage.clear();

  window.location.href =
    "/login";

}

function showToast(type, title, message){

  const toastContainer =
    document.getElementById("toastContainer");

  // SAFETY CHECK
  if(!toastContainer){
    console.error("toastContainer not found");
    return;
  }

  const toast =
    document.createElement("div");

  // ADD TYPE CLASS
  toast.className = `toast ${type}`;

  let icon = "fa-circle-check";

  if(type === "error"){
    icon = "fa-circle-xmark";
  }

  if(type === "warning"){
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

  // APPEND TO DOM
  toastContainer.appendChild(toast);

  // IMPORTANT:
  // TRIGGER SHOW ANIMATION
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.add("show");
    });
  });

  // CLOSE BUTTON
  toast.querySelector(".toast-close")
    .addEventListener("click", () => {

      toast.classList.remove("show");
      toast.classList.add("hide");

      setTimeout(() => {
        toast.remove();
      }, 400);

  });

  // AUTO REMOVE
  setTimeout(() => {

    toast.classList.remove("show");
    toast.classList.add("hide");

    setTimeout(() => {

      if(toast.parentNode){
        toast.remove();
      }

    }, 400);

  }, 4000);

}