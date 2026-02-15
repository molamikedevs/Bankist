'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,

  movementsDates: [
    '2020-01-18T21:31:17.178Z',
    '2020-02-23T07:42:02.383Z',
    '2020-03-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-06-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2020-01-01T13:15:33.035Z',
    '2020-01-30T09:48:16.867Z',
    '2020-02-25T06:04:23.907Z',
    '2020-03-25T14:18:46.235Z',
    '2020-04-05T16:33:06.386Z',
    '2020-05-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2020-01-10T10:00:00.000Z',
    '2020-02-15T12:30:00.000Z',
    '2020-03-20T09:45:00.000Z',
    '2020-04-25T14:15:00.000Z',
    '2020-05-30T16:20:00.000Z',
    '2020-06-05T11:10:00.000Z',
    '2020-07-08T08:55:00.000Z',
    '2020-08-12T19:40:00.000Z',
  ],
  currency: 'GBP',
  locale: 'en-GB',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2020-03-01T09:00:00.000Z',
    '2020-04-01T10:30:00.000Z',
    '2020-05-01T12:45:00.000Z',
    '2020-06-01T14:00:00.000Z',
    '2020-07-01T16:30:00.000Z',
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

// Display transactions
const displayTransactions = (transactions, sort = false) => {
  containerMovements.innerHTML = '';

  const trans = sort
    ? transactions.slice().sort((a, b) => a - b)
    : transactions;
  trans.forEach((trans, i) => {
    const type = trans > 0 ? 'deposit' : 'withdrawal';
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i} deposit</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${trans}€</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Calculate balance and display balance
const calAndDisplayBalance = (acc) => {
  acc.balance = acc.transactions.reduce((acc, trans) => acc + trans, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

//Calculate and display summery for deposits, withdrawals and interest
const calDisplaySummery = (acc) => {
  const deposits = acc.transactions
    .filter((deposit) => deposit > 0)
    .reduce((acc, deposit) => acc + deposit, 0);
  labelSumIn.textContent = `${deposits}€`;

  const withdrawals = acc.transactions
    .filter((withdraw) => withdraw < 0)
    .reduce((acc, withdraw) => acc + withdraw, 0);
  labelSumOut.textContent = `${Math.abs(withdrawals)}€`;

  const interest = acc.transactions
    .filter((deposit) => deposit > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
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
  displayTransactions(acc.transactions);
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
    containerApp.style.opacity = 1;
  }

  // Hide login form when user login
  // inputLoginPin.style.opacity = 0;
  // inputLoginUsername.style.opacity = 0;
  // Clear input fields
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

    // Display new changes
    updateUi(userAccount);
  }
});

// Loan event
btnLoan.addEventListener('click', (e) => {
  e.preventDefault();

  const loanAmount = Number(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    userAccount.transactions.some((trans) => trans >= loanAmount * 0.1)
  ) {
    userAccount.transactions.push(loanAmount);

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
  displayTransactions(userAccount.transactions, !sorted);
  sorted = !sorted;
});
