'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
alert(
  'its a static website  you have 4 user to login  1:js pin : 1111 , 2:jd  , pin:2222  ,3: stw   pin : 3333  ,4: ss   pin: 4444'
);

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
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

const displaymovments = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">
          ${i + 1}
          ${type}
          </div>
          
          <div class="movements__value">${mov}</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/////////////////////////////////////////////////
const calcdisplaymovements = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);

  labelBalance.textContent = `${acc.balance}€`;
};

const clacdisplaysumary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}€`;

  const outcome = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcome)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(des => (des * acc.interestRate) / 100)
    .reduce((int, mov) => int + mov, 0);

  labelSumInterest.textContent = `${interest}€`;
};

const creatusername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name.slice(0, 1);
      })
      .join('');
  });
};
creatusername(accounts);

let currentaccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentaccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentaccount?.pin === Number(inputLoginPin.value)) {
    //display ui and welcome massege
    labelWelcome.textContent = `welcome back ${
      currentaccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;
    //clear input field
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.blur();
    inputLoginPin.blur();
    //display movments
    displaymovments(currentaccount.movements);
    //display balance
    calcdisplaymovements(currentaccount);
    //display summary
    clacdisplaysumary(currentaccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amont = Number(inputTransferAmount.value);
  const receiveracc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amont > 0 &&
    currentaccount.balance >= amont &&
    receiveracc &&
    currentaccount.username !== receiveracc?.username
  ) {
    currentaccount.movements.push(-amont);
    receiveracc.movements.push(amont);
    //display movments
    displaymovments(currentaccount.movements);
    //display balance
    calcdisplaymovements(currentaccount);
    //display summary
    clacdisplaysumary(currentaccount);
  }
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentaccount.movements.some(mov => mov >= amount * 0.1)) {
    currentaccount.movements.push(amount);
    //display movments
    displaymovments(currentaccount.movements);
    //display balance
    calcdisplaymovements(currentaccount);
    //display summary
    clacdisplaysumary(currentaccount);
  } else {
    alert('any deposit > 10% of request amont');
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const deletedacc = accounts.find(
    acc => acc.username === inputCloseUsername.value
  );

  if (deletedacc && Number(inputClosePin.value) === currentaccount.pin) {
    const index = accounts.findIndex(
      acc => acc.username === currentaccount.username
    );
    inputClosePin.value = inputCloseUsername.value = '';

    // delete acc
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
});
let sortt = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  if (sortt === false) {
    currentaccount.movs = currentaccount.movements
      .slice()
      .sort((a, b) => a - b);

    displaymovments(currentaccount.movs);

    sortt = true;
  } else {
    displaymovments(currentaccount.movements);

    sortt = false;
  }
});
