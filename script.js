document.addEventListener('DOMContentLoaded', () => {
  let balance = 0;
  let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

  // Initialize the date input with today's date
  document.getElementById('transactionDate').valueAsDate = new Date();

  function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }

  function calculateTotals() {
    const expensesTotal = transactions
      .filter(transaction => transaction.amount < 0)
      .reduce((acc, transaction) => acc + transaction.amount, 0);
    const incomeTotal = transactions
      .filter(transaction => transaction.amount > 0)
      .reduce((acc, transaction) => acc + transaction.amount, 0);
    
    document.getElementById('expensesAmount').textContent = Math.abs(expensesTotal).toFixed(2);
    document.getElementById('incomeAmount').textContent = incomeTotal.toFixed(2);
    balance = incomeTotal + expensesTotal;
    updateBalance();
  }

  function updateBalance() {
    document.getElementById('balanceAmount').textContent = balance.toFixed(2);
  }

  function displayTransactions(filteredTransactions = transactions) {
    const transactionList = document.getElementById('transactionList');
    transactionList.innerHTML = '';
  
    filteredTransactions.forEach(transaction => {
      const transactionEl = document.createElement('li');
      const transactionAmount = Math.abs(transaction.amount).toFixed(2);
      const formattedAmount = transaction.amount < 0 ? `₹-${transactionAmount}` : `₹${transactionAmount}`;
  
      transactionEl.innerHTML = `
        ${transaction.description}: ${formattedAmount}
        <span class="date">${transaction.date}</span>
      `;
  
      if (transaction.amount < 0) {
        transactionEl.classList.add('expense-item');
      } else {
        transactionEl.classList.add('income-item');
      }
  
      transactionEl.addEventListener('dblclick', () => deleteTransaction(transaction.id));
      transactionList.appendChild(transactionEl);
    });
  }
  

  function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    displayTransactions();
    calculateTotals();
    saveTransactions();
  }

  function addTransaction(description, amount, isExpense = false, date = new Date()) {
    if (isExpense) {
      amount = -Math.abs(amount); // Ensure the amount is negative for expenses
    }
    const transactionDate = date ? new Date(date) : new Date();
    const transaction = {
      id: Date.now(),
      description,
      amount,
      date: transactionDate.toLocaleDateString()
    };
    transactions.push(transaction);
    displayTransactions();
    calculateTotals();
    saveTransactions();
  }

  document.getElementById('transactionForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const dateInput = document.getElementById('transactionDate');
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const isExpense = event.submitter.textContent.includes('Expense');
    const transactionDate = dateInput.value ? new Date(dateInput.value) : new Date();

    if (description && !isNaN(amount)) {
      addTransaction(description, amount, isExpense, transactionDate);
      event.target.reset(); // Reset the form
      document.getElementById('transactionDate').valueAsDate = new Date(); // Reset the date to today after form submission
    } else {
      alert('Please enter a valid description and amount');
    }
  });

  function addIncome() {
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const dateInput = document.getElementById('transactionDate');
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const transactionDate = dateInput.value ? new Date(dateInput.value) : new Date();

    if (description && !isNaN(amount)) {
      addTransaction(description, amount, false, transactionDate);
      document.getElementById('transactionForm').reset();
      document.getElementById('transactionDate').valueAsDate = new Date();
    } else {
      alert('Please enter a valid description and amount');
    }
  }

  window.addIncome = addIncome;

  // Initialize the application
  displayTransactions();
  calculateTotals();
});
