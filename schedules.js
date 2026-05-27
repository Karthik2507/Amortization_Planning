let currentPage = 0;

const pageSize = 10;

let selectedLoan = null;

const loans = [

    {
        bank: "HDFC Bank",
        id: "LN1001",
        name: "Home Loan",
        amount: 500000,
        rate: 6.5,
        term: 20,
        startDate: "2024-01-01"
    },

    {
        bank: "HDFC Bank",
        id: "LN1002",
        name: "Car Loan",
        amount: 30000,
        rate: 8.2,
        term: 5,
        startDate: "2025-01-01"
    },

    {
        bank: "ICICI Bank",
        id: "LN1003",
        name: "Education Loan",
        amount: 80000,
        rate: 7.1,
        term: 8,
        startDate: "2023-06-01"
    },

    {
        bank: "SBI Bank",
        id: "LN1004",
        name: "Business Loan",
        amount: 150000,
        rate: 9.4,
        term: 10,
        startDate: "2024-03-01"
    }
];

/* INITIALIZE */

window.onload = () => {

    loadBanks();

    setupButtons();

    document
        .getElementById("bankSelector")
        .addEventListener("change", () => {

            currentPage = 0;

            loadLoans();
        });

    document
        .getElementById("loanSelector")
        .addEventListener("change", () => {

            currentPage = 0;

            loadSelectedLoan();
        });
};

/* LOAD BANKS */

function loadBanks() {

    const bankSelector =
        document.getElementById("bankSelector");

    const banks =
        [...new Set(loans.map(loan => loan.bank))];

    bankSelector.innerHTML = "";

    banks.forEach(bank => {

        const option =
            document.createElement("option");

        option.value = bank;

        option.textContent = bank;

        bankSelector.appendChild(option);
    });

    loadLoans();
}

/* LOAD LOANS */

function loadLoans() {

    const selectedBank =
        document.getElementById("bankSelector").value;

    const loanSelector =
        document.getElementById("loanSelector");

    loanSelector.innerHTML = "";

    const filteredLoans =
        loans.filter(
            loan => loan.bank === selectedBank
        );

    if (filteredLoans.length === 0) {

        loanSelector.innerHTML =
            `<option value="">No Loans Available</option>`;

        document.getElementById("scheduleBody").innerHTML =
            `
            <tr>
                <td colspan="8" style="text-align:center;padding:20px;">
                    No loan records found
                </td>
            </tr>
            `;

        return;
    }

    filteredLoans.forEach(loan => {

        const option =
            document.createElement("option");

        option.value = loan.id;

        option.textContent =
            `${loan.id} - ${loan.name}`;

        loanSelector.appendChild(option);
    });

    loadSelectedLoan();
}

/* SELECT LOAN */

function loadSelectedLoan() {

    const loanId =
        document.getElementById("loanSelector").value;

    if (!loanId) {

        document.getElementById("scheduleBody").innerHTML =
            `
            <tr>
                <td colspan="8" style="text-align:center;padding:20px;">
                    No loan selected
                </td>
            </tr>
            `;

        return;
    }

    selectedLoan =
        loans.find(loan => loan.id === loanId);

    renderTable();
}

/* RENDER TABLE */

function renderTable() {

    if (!selectedLoan) return;

    const tbody =
        document.getElementById("scheduleBody");

    tbody.innerHTML = "";

    const P = selectedLoan.amount;

    const r =
        selectedLoan.rate / 100 / 12;

    const n =
        selectedLoan.term * 12;

    const EMI =
        (P * r * Math.pow(1 + r, n)) /
        (Math.pow(1 + r, n) - 1);

    let balance = P;

    const baseDate =
        new Date(selectedLoan.startDate);

    const start =
        currentPage * pageSize;

    const end =
        start + pageSize;

    for (let i = 0; i < n; i++) {

        const interest =
            balance * r;

        const principal =
            EMI - interest;

        balance -= principal;

        if (balance < 0) {
            balance = 0;
        }

        const paymentDate =
            new Date(baseDate);

        paymentDate.setMonth(
            paymentDate.getMonth() + i + 1
        );

        if (i >= start && i < end) {

            tbody.innerHTML += `
            
                <tr>

                    <td>${i + 1}</td>

                    <td>
                        ${selectedLoan.bank}
                    </td>

                    <td>
                        ${selectedLoan.name}
                    </td>

                    <td>
                        ${paymentDate.toLocaleDateString()}
                    </td>

                    <td>
                        ${formatCurrency(EMI)}
                    </td>

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

                    <td class="balance-value">
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

/* BUTTONS */

function setupButtons() {

    document
        .getElementById("nextPageBtn")
        .addEventListener("click", () => {

            currentPage++;

            renderTable();
        });

    document
        .getElementById("prevPageBtn")
        .addEventListener("click", () => {

            if (currentPage > 0) {

                currentPage--;

                renderTable();
            }
        });

    document
        .getElementById("newLoanBtn")
        .addEventListener("click", () => {

            window.location.href =
                "newloan.html";
        });
}

/* FORMAT CURRENCY */

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