'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  transactions: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  transactions: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  transactions: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
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
const displayMovement = (transactions) => {
  containerMovements.innerHTML = '';
  transactions.forEach((trans, i) => {
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
const calAndDisplayBalance = (transactions) => {
  const balance = transactions.reduce((acc, trans) => acc + trans, 0);
  labelBalance.textContent = `${balance}€`;
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

// Events listeners
let userAccount;

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
  inputLoginPin.style.opacity = 0;
  inputLoginUsername.style.opacity = 0;
  btnLogin.style.opacity = 0;

  //Display transactions
  displayMovement(userAccount.transactions);
  // Display balance
  calAndDisplayBalance(userAccount.transactions);
  //Display summery
  calDisplaySummery(userAccount);
});
