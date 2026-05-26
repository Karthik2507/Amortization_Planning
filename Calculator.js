// NEW LOAN BUTTON

const newLoanBtn = document.getElementById("newLoanBtn");

newLoanBtn.addEventListener("click", () => {
    window.location.href = "newloan.html";
});

// RECALCULATE BUTTON

const recalculateBtn = document.getElementById("recalculateBtn");

recalculateBtn.addEventListener("click", calculateAmortization);

// VIEW FULL SCHEDULE BUTTON

const viewAllBtn =
    document.getElementById("viewAllBtn");

viewAllBtn.addEventListener("click", () => {

    showFullSchedule = !showFullSchedule;

    calculateAmortization();

});

//  SETTINGS BUTTON

const newLoanBtn = document.getElementById("newLoanBtn");

newLoanBtn.addEventListener("click", () => {
    window.location.href = "newloan.html";
});

// MAIN FUNCTION
let showFullSchedule = false;

function calculateAmortization() {

    // INPUT VALUES

    const loanAmount =
        parseFloat(document.getElementById("loanAmount").value);

    const annualRate =
        parseFloat(document.getElementById("interestRate").value);

    const loanTermYears =
        parseInt(document.getElementById("loanTerm").value);

    const startDateValue =
        document.getElementById("startDate").value;

    // VALIDATION

    if (!loanAmount || !annualRate || !loanTermYears) {
        alert("Please enter all loan details");
        return;
    }

    // START DATE

    const startDate = startDateValue
        ? new Date(startDateValue)
        : new Date();

    // CURRENT DATE

    const currentDate = new Date();

    // MONTHLY VALUES

    const monthlyRate = annualRate / 100 / 12;

    const totalPayments = loanTermYears * 12;

    //
// UPDATE VIEW ALL BUTTON TEXT
//

document.getElementById("viewAllBtn").innerText =
    `View Full ${totalPayments} Month Schedule ▼`;

    // EMI FORMULA

    const monthlyPayment =
        (loanAmount * monthlyRate *
            Math.pow(1 + monthlyRate, totalPayments)) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1);

    // MONTHS PAID

    let monthsPaid =
        (currentDate.getFullYear() - startDate.getFullYear()) * 12;

    monthsPaid +=
        currentDate.getMonth() - startDate.getMonth();

    // LIMITS

    if (monthsPaid < 0) {
        monthsPaid = 0;
    }

    if (monthsPaid > totalPayments) {
        monthsPaid = totalPayments;
    }

    // VARIABLES

    let balance = loanAmount;

    let totalPaidTillNow = 0;

    let paymentDate = new Date(startDate);

    // TABLE BODY

    const tbody = document.getElementById("scheduleBody");

    tbody.innerHTML = "";

    // LOOP

//
// CALCULATE PAID AMOUNT + REMAINING BALANCE
//

for (let i = 1; i <= monthsPaid; i++) {

    const interest = balance * monthlyRate;

    const principal = monthlyPayment - interest;

    balance -= principal;

    if (balance < 0) {
        balance = 0;
    }

    totalPaidTillNow += monthlyPayment;
}

//
// RESET VALUES FOR TABLE
//

let tableBalance = loanAmount;

paymentDate = new Date(startDate);

// START TABLE FROM NEXT MONTH
paymentDate.setMonth(
    paymentDate.getMonth() + 1
);

//
// SHOW FIRST 12 MONTHS IN TABLE
//
//
// SHOW MONTHS
//

const monthsToShow =
    showFullSchedule
        ? totalPayments
        : Math.min(12, totalPayments);

//
// UPDATE BUTTON TEXT
//

viewAllBtn.innerText = showFullSchedule
    ? "Show Less ▲"
    : `View Full ${totalPayments} Month Schedule ▼`;

//
// TABLE LOOP
//

for (let i = 1; i <= monthsToShow; i++) {

    const interest = tableBalance * monthlyRate;

    const principal = monthlyPayment - interest;

    tableBalance -= principal;

    if (tableBalance < 0) {
        tableBalance = 0;
    }

    //
// TOTAL INTEREST
//

const totalAmountPaid =
    monthlyPayment * totalPayments;

const totalInterestPaid =
    totalAmountPaid - loanAmount;

//
// PAYOFF DATE
//

const payoffDate = new Date(startDate);

payoffDate.setFullYear(
    payoffDate.getFullYear() + loanTermYears
);

const payoffText =
    payoffDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric"
    });

//
// KPI 1
// PRINCIPAL AMOUNT
//

document.getElementById("principalAmount").innerText =
    "$" + loanAmount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

//
// KPI 2
// TOTAL INTEREST
//

document.getElementById("totalInterest").innerText =
    "$" + totalInterestPaid.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

//
// KPI 3
// TOTAL PAYMENT
//

document.getElementById("totalPayment").innerText =
    "$" + totalAmountPaid.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

//
// PAYOFF DATE TEXT
//

document.getElementById("payoffDate").innerText =
    "⏱ Expected Closure Date: " + payoffText;

//
// KPI 4
// REMAINING BALANCE
//

document.getElementById("remainingBalance").innerText =
    "$" + balance.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // CHECK CURRENT MONTH

    const isCurrentMonth =
        paymentDate.getMonth() === currentDate.getMonth() &&
        paymentDate.getFullYear() === currentDate.getFullYear();

    const formattedDate =
        paymentDate.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric"
        });

    const row = `
        <tr class="${isCurrentMonth ? "current-month" : ""}">
            <td>${i}</td>
            <td>${formattedDate}</td>
            <td>$${monthlyPayment.toFixed(2)}</td>
            <td>
   <span class="principal-value">
      $${principal.toFixed(2)}
   </span>
</td>

<td>
   <span class="interest-value">
      $${interest.toFixed(2)}
   </span>
</td>
            <td class="bold">$${tableBalance.toFixed(2)}</td>
        </tr>
    `;

    tbody.innerHTML += row;

    paymentDate.setMonth(
        paymentDate.getMonth() + 1
    );
}
}
// AUTO LOAD

calculateAmortization();

// EXPORT REPORT BUTTON

const exportBtn =
    document.getElementById("exportBtn");

exportBtn.addEventListener("click", exportReport);

// EXPORT FUNCTION

function exportReport() {

    // GET TABLE

    const table =
        document.querySelector("table");

    // GET SUMMARY VALUES

    const principal =
        document.getElementById("principalAmount").innerText;

    const interest =
        document.getElementById("totalInterest").innerText;

    const totalPayment =
        document.getElementById("totalPayment").innerText;

    const remainingBalance =
        document.getElementById("remainingBalance").innerText;

    const payoffDate =
        document.getElementById("payoffDate").innerText;

    // CREATE REPORT CONTENT

    let reportContent = `
AMORTIZATION REPORT
===============================

Total Principal : ${principal}

Total Interest : ${interest}

Total Payment : ${totalPayment}

Remaining Balance : ${remainingBalance}

${payoffDate}

===============================
AMORTIZATION SCHEDULE
===============================

`;

    // GET TABLE ROWS

    const rows =
        table.querySelectorAll("tbody tr");

    rows.forEach((row) => {

        const cols = row.querySelectorAll("td");

        reportContent += `
Payment # : ${cols[0].innerText}
Date      : ${cols[1].innerText}
Payment   : ${cols[2].innerText}
Principal : ${cols[3].innerText}
Interest  : ${cols[4].innerText}
Balance   : ${cols[5].innerText}

--------------------------------
`;

    });

    // CREATE TEXT FILE

    const blob = new Blob(
        [reportContent],
        { type: "text/plain" }
    );

    // DOWNLOAD LINK

    const link =
        document.createElement("a");

    link.href =
        URL.createObjectURL(blob);

    link.download =
        "Amortization_Report.txt";

    // DOWNLOAD FILE

    link.click();
}

// EXPORT PDF BUTTON

const exportPdfBtn =
    document.getElementById("exportPdfBtn");

exportPdfBtn.addEventListener("click", exportPDF);

// PDF EXPORT FUNCTION

function exportPDF() {

    // jsPDF INIT

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    // GET VALUES

    const principal =
        document.getElementById("principalAmount").innerText;

    const interest =
        document.getElementById("totalInterest").innerText;

    const totalPayment =
        document.getElementById("totalPayment").innerText;

    const remainingBalance =
        document.getElementById("remainingBalance").innerText;

    const payoffDate =
        document.getElementById("payoffDate").innerText;

    // TITLE

    doc.setFontSize(18);
    doc.text("Amortization Report", 20, 20);

    // SUMMARY

    doc.setFontSize(12);

    doc.text(`Total Principal: ${principal}`, 20, 40);
    doc.text(`Total Interest: ${interest}`, 20, 50);
    doc.text(`Total Payment: ${totalPayment}`, 20, 60);
    doc.text(`Remaining Balance: ${remainingBalance}`, 20, 70);
    const cleanPayoffDate =
    payoffDate.replace("⏱", "");

doc.text(cleanPayoffDate, 20, 80);

    // TABLE HEADER

    let y = 100;

    doc.setFontSize(11);

    doc.text("P#", 20, y);
    doc.text("Date", 35, y);
    doc.text("Payment", 65, y);
    doc.text("Principal", 100, y);
    doc.text("Interest", 135, y);
    doc.text("Balance", 170, y);

    y += 10;

    // GET TABLE ROWS

    const rows =
        document.querySelectorAll("#scheduleBody tr");

    rows.forEach((row) => {

        const cols = row.querySelectorAll("td");

        doc.text(cols[0].innerText, 20, y);
        doc.text(cols[1].innerText, 35, y);
        doc.text(cols[2].innerText, 65, y);
        doc.text(cols[3].innerText, 100, y);
        doc.text(cols[4].innerText, 135, y);
        doc.text(cols[5].innerText, 170, y);

        y += 10;

        // NEW PAGE IF NEEDED

        if (y > 280) {
            doc.addPage();
            y = 20;
        }

    });

    // SAVE PDF

    doc.save("Amortization_Report.pdf");
}