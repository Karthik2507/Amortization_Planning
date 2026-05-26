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
      toast.remove();
    }, 400);
  }, 4000);
}

window.onload = function () {
  const createLoanBtn = document.getElementById("createLoanBtn");

  const cancelBtn = document.getElementById("cancelBtn");

  const popupOverlay = document.getElementById("popupOverlay");

  const popupDetails = document.getElementById("popupDetails");

  const editBtn = document.getElementById("editBtn");

  const submitBtn = document.getElementById("submitBtn");

  createLoanBtn.addEventListener("click", function () {
    const loanID = document.getElementById("loanID").value;

    const lender = document.getElementById("lender").value;

    const loanName = document.getElementById("loanName").value;

    const loanAmount = document.getElementById("loanAmount").value;

    const interestRate = document.getElementById("interestRate").value;

    const loanTerm = document.getElementById("loanTerm").value;

    const startDate = document.getElementById("startDate").value;

    if (
      loanID === "" ||
      lender === "" ||
      loanName === "" ||
      loanAmount === "" ||
      interestRate === "" ||
      loanTerm === "" ||
      startDate === ""
    ) {
      showToast(
        "error",
        "Missing Fields",
        "Please complete all required loan information.",
      );

      return;
    }

    popupDetails.innerHTML = `

  <p>
    <strong>Loan ID:</strong>
    <span style="color:#dc2626; font-weight:700;">
      ${loanID}
    </span>
  </p>

  <p>
    <strong>Lender:</strong>
    ${lender}
  </p>

  <p>
    <strong>Loan Name:</strong>
    ${loanName}
  </p>

  <p>
    <strong>Principal Amount ($):</strong>
    <span style="color:#dc2626; font-weight:700;">
      $${loanAmount}
    </span>
  </p>

  <p>
    <strong>Annual Interest Rate (%):</strong>
    <span style="color:#dc2626; font-weight:700;">
      ${interestRate}%
    </span>
  </p>

  <p>
    <strong>Loan Term (Years):</strong>
    <span style="color:#dc2626; font-weight:700;">
      ${loanTerm}
    </span>
  </p>

  <p>
    <strong>Start Date:</strong>
    <span style="color:#dc2626; font-weight:700;">
      ${startDate}
    </span>
  </p>

`;

    popupOverlay.style.display = "flex";
  });

  editBtn.addEventListener("click", function () {
    popupOverlay.style.display = "none";
  });

  submitBtn.addEventListener("click", function () {
    const loanData = {
      loanID: document.getElementById("loanID").value,

      lender: document.getElementById("lender").value,

      loanName: document.getElementById("loanName").value,

      loanAmount: document.getElementById("loanAmount").value,

      interestRate: document.getElementById("interestRate").value,

      loanTerm: document.getElementById("loanTerm").value,

      startDate: document.getElementById("startDate").value,
    };

    localStorage.setItem("loanData", JSON.stringify(loanData));

    popupOverlay.style.display = "none";

    showToast(
      "success",
      "Loan Created Successfully",
      "Your loan profile has been saved.",
    );

    setTimeout(() => {
      window.location.href = "calculator.html";
    }, 1800);
  });

  cancelBtn.addEventListener("click", function () {
    document.querySelectorAll("input").forEach((input) => {
      input.value = "";
    });

    showToast(
      "warning",
      "Form Cleared",
      "All entered loan information has been removed.",
    );
  });
};
