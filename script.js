'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  transactions: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,

  transactionDates: [
    '2026-02-16T09:00:00.000Z',
    '2026-02-15T10:30:00.000Z',
    '2026-02-13T14:20:00.000Z',
    '2026-02-11T08:45:00.000Z',
    '2026-02-09T16:10:00.000Z',
    '2026-02-06T12:00:00.000Z',
    '2026-02-02T18:30:00.000Z',
    '2026-01-27T11:15:00.000Z',
  ],

  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  transactionDates: [
    '2026-02-16T13:15:33.035Z',
    '2026-02-14T09:48:16.867Z',
    '2026-02-12T06:04:23.907Z',
    '2026-02-10T14:18:46.235Z',
    '2026-02-08T16:33:06.386Z',
    '2026-02-05T14:43:26.374Z',
    '2026-01-29T18:49:59.371Z',
    '2026-01-22T12:01:20.894Z',
  ],

  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  transactions: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  transactionDates: [
    '2026-02-15T10:00:00.000Z',
    '2026-02-13T12:30:00.000Z',
    '2026-02-10T09:45:00.000Z',
    '2026-02-07T14:15:00.000Z',
    '2026-02-03T16:20:00.000Z',
    '2026-01-30T11:10:00.000Z',
    '2026-01-25T08:55:00.000Z',
    '2026-01-18T19:40:00.000Z',
  ],

  currency: 'GBP',
  locale: 'en-GB',
};

const account4 = {
  owner: 'Sarah Smith',
  transactions: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  transactionDates: [
    '2026-02-16T09:00:00.000Z',
    '2026-02-14T10:30:00.000Z',
    '2026-02-11T12:45:00.000Z',
    '2026-02-08T14:00:00.000Z',
    '2026-02-03T16:30:00.000Z',
  ],

  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formattedTransactionDate = (date) => {
  const calDaysPassed = (day1, day2) =>
    Math.round(Math.abs(day2 - day1) / (1000 * 60 * 60 * 24));
  const daysPassed = calDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
// Display transactions
const displayTransactions = (acc, sort = false) => {
  containerMovements.innerHTML = '';
  const transactionsAndDates = acc.transactions.map((trans, i) => ({
    transaction: trans,
    transactionDate: acc.transactionDates[i],
  }));

  if (sort) transactionsAndDates.sort((a, b) => a.transaction - b.transaction);

  transactionsAndDates.forEach(({ transaction, transactionDate }, i) => {
    const date = new Date(transactionDate);
    const displayDate = formattedTransactionDate(date);

    const type = transaction > 0 ? 'deposit' : 'withdrawal';
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i} deposit</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${transaction.toFixed(2)}€</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Calculate balance and display balance
const calAndDisplayBalance = (acc) => {
  acc.balance = acc.transactions.reduce((acc, trans) => acc + trans, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

//Calculate and display summery for deposits, withdrawals and interest
const calDisplaySummery = (acc) => {
  const deposits = acc.transactions
    .filter((deposit) => deposit > 0)
    .reduce((acc, deposit) => acc + deposit, 0);
  labelSumIn.textContent = `${deposits.toFixed(2)}€`;

  const withdrawals = acc.transactions
    .filter((withdraw) => withdraw < 0)
    .reduce((acc, withdraw) => acc + withdraw, 0);
  labelSumOut.textContent = `${withdrawals.toFixed(2)}€`;

  const interest = acc.transactions
    .filter((deposit) => deposit > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

// Set username initials
const createUsernames = (usernames) => {
  usernames.forEach((names) => {
    names.username = names.owner
      .toLowerCase()
      .split(' ')
      .map((name) => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUi = (acc) => {
  displayTransactions(acc);
  // Display balance
  calAndDisplayBalance(acc);
  //Display summery
  calDisplaySummery(acc);
};

// Events listeners
let userAccount;

// Login Event
btnLogin.addEventListener('click', (e) => {
  // Prevent default
  e.preventDefault();

  // Find current user
  userAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value,
  );

  // Check if pin matches the user's pin
  if (userAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${userAccount.owner.split(' ')[0]}`;
  }

  containerApp.style.opacity = 1;
  const now = new Date();
  const day = `${now.getDate()}`.padStart(2, 0);
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const year = `${now.getFullYear()}`.padStart(2, 0);
  const hour = `${now.getHours()}`.padStart(2, 0);
  const min = `${now.getMinutes()}`.padStart(2, 0);

  labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();

  //Display transactions
  updateUi(userAccount);
});

// Transfer Event
btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();

  const transferAmount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    (acc) => acc.username === inputTransferTo.value,
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    transferAmount > 0 &&
    receiverAccount &&
    userAccount.balance >= transferAmount &&
    receiverAccount?.username !== userAccount.username
  ) {
    userAccount.transactions.push(-transferAmount);
    receiverAccount.transactions.push(transferAmount);

    userAccount.transactionDates.push(new Date().toISOString());
    receiverAccount.transactionDates.push(new Date().toISOString());

    // Display new changes
    updateUi(userAccount);
  }
});

// Loan event
btnLoan.addEventListener('click', (e) => {
  e.preventDefault();

  const loanAmount = Math.floor(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    userAccount.transactions.some((trans) => trans >= loanAmount * 0.1)
  ) {
    userAccount.transactions.push(loanAmount);
    userAccount.transactionDates.push(new Date());

    // Update ui to track changes
    updateUi(userAccount);
  }

  // Rest input filed
  inputLoanAmount.value = '';
});

// Close account event
btnClose.addEventListener('click', (e) => {
  e.preventDefault();

  if (
    inputCloseUsername.value === userAccount.username &&
    Number(inputClosePin.value) === userAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === userAccount.username,
    );
    console.log(index);
    accounts.splice(index, 1);

    labelWelcome.textContent = `Log in to get started`;
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// Sort Event
let sorted = false;
btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  displayTransactions(userAccount, !sorted);
  sorted = !sorted;
});
