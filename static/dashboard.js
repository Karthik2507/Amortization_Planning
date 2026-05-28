let balanceChart;
let breakdownChart;

let currentPage = 0;
const pageSize = 12;

let currentLoan = null;

let loans = [];

window.onload = () => {
    loadLoans();
    setupButtons();
};

function loadLoans() {

    loans = [
        {
            id: "LN1001",
            name: "Home Loan",
            amount: 500000,
            rate: 6.5,
            term: 20,
            startDate: "2024-01-01"
        },
        {
            id: "LN1002",
            name: "Car Loan",
            amount: 30000,
            rate: 8.2,
            term: 5,
            startDate: "2026-01-01"
        }
    ];

    document.getElementById("activeLoans").innerText =
        loans.length;

    const selector =
        document.getElementById("loanSelector");

    selector.innerHTML = "";

    loans.forEach(loan => {

        const option =
            document.createElement("option");

        option.value = loan.id;

        option.textContent =
            `${loan.id} - ${loan.name}`;

        selector.appendChild(option);
    });

    selector.addEventListener("change", e => {

        currentPage = 0;

        loadSelectedLoan(e.target.value);
    });

    loadSelectedLoan(loans[0].id);
}

function loadSelectedLoan(id) {

    currentLoan =
        loans.find(l => l.id === id);

    calculate();
}

function calculate() {

    const P = currentLoan.amount;

    const r = currentLoan.rate / 100 / 12;

    const n = currentLoan.term * 12;

    const EMI =
        (P * r * Math.pow(1 + r, n)) /
        (Math.pow(1 + r, n) - 1);

    const totalInterest =
        (EMI * n) - P;

    const monthsPaid =
        getMonthsPassed(currentLoan.startDate);

    const balance =
        getRemainingBalance(P, r, EMI, monthsPaid);

    setValue("monthlyPayment", EMI);

    setValue("principalAmount", P);

    setValue("totalInterest", totalInterest);

    setValue("remainingBalance", balance);

    renderTable(P, r, EMI, n);

    generateBalanceChart(P, r, EMI, n);

    generateBreakdownChart(P, totalInterest);

    generateInsights(
        P,
        totalInterest,
        EMI,
        currentLoan.rate
    );
}

function getMonthsPassed(startDate) {

    const start = new Date(startDate);

    const today = new Date();

    let months =
        (today.getFullYear() - start.getFullYear()) * 12;

    months += today.getMonth() - start.getMonth();

    if (months < 0) months = 0;

    return months;
}

function getRemainingBalance(P, r, EMI, months) {

    let balance = P;

    for (let i = 0; i < months; i++) {

        const interest = balance * r;

        const principal = EMI - interest;

        balance -= principal;

        if (balance < 0) {
            balance = 0;
        }
    }

    return balance;
}

function renderTable(P, r, EMI, n) {

    const tbody =
        document.getElementById("scheduleBody");

    tbody.innerHTML = "";

    let balance = P;

    let date =
        new Date(currentLoan.startDate);

    const start =
        currentPage * pageSize;

    const end =
        start + pageSize;

    for (let i = 0; i < n; i++) {

        const interest = balance * r;

        const principal = EMI - interest;

        balance -= principal;

        if (balance < 0) balance = 0;

        date.setMonth(date.getMonth() + 1);

        if (i >= start && i < end) {

            tbody.innerHTML += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${date.toLocaleDateString()}</td>
                    <td>${formatCurrency(EMI)}</td>
                    <td>
                        <span class="principal-value">
                            ${formatCurrency(principal)}
                        </span>
                    </td>
                    <td>
                        <span class="interest-value">
                            ${formatCurrency(interest)}
                        </span>
                    </td>
                    <td class="bold">
                        ${formatCurrency(balance)}
                    </td>
                </tr>
            `;
        }
    }

    document.getElementById("prevPageBtn").disabled =
        currentPage === 0;

    document.getElementById("nextPageBtn").disabled =
        end >= n;
}

function generateBalanceChart(P, r, EMI, n) {

    let balance = P;

    const labels = ["Start"];

    const balances = [P];

    for (let i = 1; i <= n; i++) {

        const interest = balance * r;

        const principal = EMI - interest;

        balance -= principal;

        if (balance < 0) balance = 0;

        if (i % 12 === 0 || i === n) {

            labels.push(`Year ${Math.ceil(i / 12)}`);

            balances.push(balance.toFixed(2));
        }
    }

    if (balanceChart) {
        balanceChart.destroy();
    }

    balanceChart = new Chart(
        document.getElementById("balanceChart"),
        {
            type: "line",

            data: {
                labels,
                datasets: [{
                    label: "Balance",
                    data: balances,
                    borderColor: "#2563eb",
                    backgroundColor: "rgba(37,99,235,0.1)",
                    fill: true,
                    tension: 0.4
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        }
    );
}

function generateBreakdownChart(principal, interest) {

    if (breakdownChart) {
        breakdownChart.destroy();
    }

    breakdownChart = new Chart(
        document.getElementById("breakdownChart"),
        {
            type: "doughnut",

            data: {
                labels: [
                    "Principal",
                    "Interest"
                ],

                datasets: [{
                    data: [
                        principal,
                        interest
                    ],

                    backgroundColor: [
                        "#2563eb",
                        "#ef4444"
                    ],

                    hoverOffset: 18
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "65%"
            }
        }
    );
}

function generateInsights(P, interest, EMI, rate) {

    const burden =
        ((interest / P) * 100).toFixed(1);

    let risk = "Low";

    if (rate > 10) risk = "High";
    else if (rate > 6) risk = "Medium";

    document.getElementById("loanInsights").innerHTML = `
    
        <div class="insight-box">
            <i class="fa-solid fa-chart-pie"></i>
            <h4>Interest Burden</h4>
            <p>${burden}% of loan amount paid as interest.</p>
        </div>

        <div class="insight-box">
            <i class="fa-solid fa-wallet"></i>
            <h4>Monthly EMI</h4>
            <p>${formatCurrency(EMI)} fixed monthly payment.</p>
        </div>

        <div class="insight-box">
            <i class="fa-solid fa-shield-halved"></i>
            <h4>Risk Level</h4>
            <p>${risk} risk loan profile.</p>
        </div>
    `;
}

function setupButtons() {

    document.getElementById("nextPageBtn")
    .addEventListener("click", () => {

        currentPage++;

        calculate();
    });

    document.getElementById("prevPageBtn")
    .addEventListener("click", () => {

        if (currentPage > 0) {

            currentPage--;

            calculate();
        }
    });

    document.getElementById("newLoanBtn")
    .addEventListener("click", () => {

        window.location.href = "/newloan";
    });
}

function setValue(id, value) {

    document.getElementById(id).innerText =
        formatCurrency(value);
}

function formatCurrency(value) {

    return "$" +
        Number(value).toLocaleString(
            undefined,
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
}