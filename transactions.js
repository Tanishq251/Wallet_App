document.addEventListener('DOMContentLoaded', () => {
  // Retrieve transactions from local storage or set to empty array if none exist
  let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

  // Calculate the sum of transactions for a given month and year
  function sumByMonth(month, year, transactionsList) {
    return transactionsList
      .filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === month && transactionDate.getFullYear() === year;
      })
      .reduce((total, transaction) => total + transaction.amount, 0);
  }

  // Display totals for the current and previous month
  function displayMonthlyTotals() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthTotal = sumByMonth(currentMonth, currentYear, transactions);
    const previousMonthTotal = sumByMonth(previousMonth, previousYear, transactions);

    document.getElementById('currentMonthTotal').textContent = `Current Month: ₹${currentMonthTotal.toFixed(2)}`;
    document.getElementById('previousMonthTotal').textContent = `Previous Month: ₹${previousMonthTotal.toFixed(2)}`;
  }

  // Display all transactions in the list
  function displayAllTransactions() {
    const transactionsListElement = document.getElementById('fullTransactionList');
    transactionsListElement.innerHTML = '';

    transactions.forEach(transaction => {
      const listItem = document.createElement('li');
      const transactionDate = new Date(transaction.date);
      const formattedDate = transactionDate.toLocaleDateString('en-IN');

      listItem.innerHTML = `
        ${transaction.description}: ₹${Math.abs(transaction.amount).toFixed(2)}
        <span class="date">${formattedDate}</span>
      `;
      listItem.classList.add(transaction.amount < 0 ? 'expense' : 'income'); // Apply class based on transaction type
      listItem.addEventListener('dblclick', () => deleteTransaction(transaction.id));
      transactionsListElement.appendChild(listItem);
    });
  }

  // Delete a transaction by its ID
  function deleteTransaction(transactionId) {
    transactions = transactions.filter(transaction => transaction.id !== transactionId);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    displayAllTransactions();
    displayMonthlyTotals();
  }

  // Clear all transactions
  function clearAllTransactions() {
    transactions = [];
    localStorage.setItem('transactions', JSON.stringify(transactions));
    displayAllTransactions();
    displayMonthlyTotals();
  }

  // Attach event listener to the "Clear All" button
  document.getElementById('clearAllBtn').addEventListener('click', clearAllTransactions);

  // Initial display calls
  displayAllTransactions();
  displayMonthlyTotals();
});
