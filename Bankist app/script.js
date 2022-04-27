'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  //text content = 0;

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>
        `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDispaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int > 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const updateUI = function (acc) {
  calcDisplayBalance(acc);
  calcDispaySummary(acc);
  displayMovements(acc.movements);
};

// EVENT HANDLER
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // DISPLAY UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    //CLEAR INPUT FIELNDS

    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();

    // UPADATE UI

    updateUI(currentAccount);
  }
});

///TRANSFER BUTTON

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    // UPADATE UI

    updateUI(currentAccount);
  }
});
// ADD LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //ADD MOVEMENT
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

// BUTTON CLOSE
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // DELETE ACCOUNT
    accounts.splice(index, 1);

    // HIDE UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault;
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const user = 'Steven Thomas Williams';
/*const username = user
  .toLowerCase()
  .split(' ')
  .map(name => name[0])
  .join('');*/

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsername(accounts);

const deposits = movements.filter(mov => mov > 0);

console.log(deposits);

const withdrawals = movements.filter(mov => mov < 0);

console.log(withdrawals);

const balance3 = movements.reduce(
  /*first argument*/ function (acc, /*acumulator*/ element, i, arr) {
    console.log(`itteration number ${i}: ${acc}`);
    return acc + element;
  },
  0 /*where we start counting or adding*/
);

const balance2 = movements.reduce((acc, cur) => acc + cur, 0);

const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);

console.log(max);
/*
const testData = [5, 2, 4, 1, 15, 8, 3];
const testData2 = [16, 6, 10, 5, 6, 1, 4];

//btnSort.addEventListener('click', function () {});

const humanYears = testData2.map(dog => {
  if (dog <= 2) {
    return dog * 2;
  } else {
    return 16 + dog * 4;
  }
});

console.log(humanYears);

const oldDogs = humanYears.filter(dog => dog >= 18);

console.log(oldDogs);

const avg = oldDogs.reduce((acc, dog) => (acc += dog), 0) / oldDogs.length;

console.log(avg);

const calcAndReduceDogAge = arr =>
  arr
    .map(dog => (dog <= 2 ? dog * 2 : 16 + dog * 4))
    .filter(dog => dog >= 18)
    .reduce((acc, dog, i, arrFinal) => acc + dog / arrFinal.length, 0);
//const avg = sum.reduce((acc, dog, i, arrFinal) => acc + dog, 0) / sum.length;

const avg1 = calcAndReduceDogAge(testData);

console.log(avg1);
/*
const julia = [3, 5, 2, 12, 7];

const kate = [4, 1, 15, 8, 3];

const julia3 = [9, 16, 6, 8, 3];

const kate2 = [10, 5, 6, 1, 4];

console.log(julia.slice(1, -2));

const checkDogs = function (arr1, arr2) {
  const julia2 = arr1.slice(1, -2);
  const joined = julia2.concat(arr2);
  console.log(joined);
  joined.forEach(function (dog, i) {
    if (dog >= 3) {
      console.log(`Dog number ${i + 1} is an adult and is ${dog} years old`);
    } else {
      console.log(`Dog number ${i + 1} is a puppy and is ${dog} years old`);
    }
  });
};
checkDogs(julia3, kate2);

/////////////////////////////////////////////////

/*let arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.slice(2));

console.log(arr.slice(2, 4));

console.log(arr.slice(-2));

console.log(arr.slice(1, -2));

//console.log(arr.splice(2));

arr.splice(-1);

console.log(arr);

const arr2 = ['j', 'i', 'h', 'g', 'f'];

console.log(arr2.reverse());

const letters = arr.concat(arr2);

console.log(letters);

console.log(letters.join(' - '));


const arr = [23, 11, 64];

console.log(arr.at(-1));



const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/*for (const movement of movements) {
  if (movement > 0) {
    console.log(`You deposited ${movement}`);
  } else {
    console.log(`You withdrew ${movement}`);
  }
}

movements.forEach(function (movement, i, arr) {
  if (movement > 0) {
    console.log(`Movemnt ${i + 1} : You deposited ${movement}`);
  } else {
    console.log(`Movemnt ${i + 1} : You withdrew ${Math.abs(movement)}`);
  }
});

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

console.log(currencies);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);

currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}: ${value}`);
});

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/*const eurToUsd = 1.1;

const movementsUSD = movements.map(function (mov) {
  return mov * eurToUsd;
});

const movementsUSD2 = movements.map(mov => mov * eurToUsd);

const movementDesc = movements.map(
  (mov, i) =>
    `Movement ${i + 1} : You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);

/*if (mov > 0) {
    return `Movemnt ${i + 1} : You deposited ${mov}`;
  } else {
    return `Movemnt ${i + 1} : You withdrew ${Math.abs(mov)}`;
  }

console.log(movementDesc);

const movements1 = [200, 450, -400, 3000, -650, -130, 70, 1300];

const anyDeposits = movements1.some(mov => mov > 2000);

//console.log(anyDeposits);

const everyDeposits = movements1.every(mov => mov > 0);

//console.log(everyDeposits);

// SEPERATE CALLBACK

const deposit1 = mov => mov > 0;
console.log(movements1.some(deposit1));
console.log(movements1.every(deposit1));
console.log(movements1.filter(deposit1));


const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, 5, 6], 7, 8];

console.log(arrDeep.flat());

const overalBalance = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, cur) => acc + cur, 0);

console.log(overalBalance);

//STRINGS

const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];

console.log(owners.sort());

//NUMBERS

//return <0 A,B
//return >0 B,A

movements.sort((a, b) => a - b);
console.log(movements);
*/

//EMPTY ARRAY + FILL METHOD
const x = new Array(7);
console.log(x);

x.fill(1, 3, 5);
console.log(x);

//ARRAY.FROM

const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 100 }, () => Math.trunc(Math.random() * 100));
console.log(z);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);
});

const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, cur) => {
    if (cur > 0) acc.push(cur);
    return acc;
  }, []);

console.log(bankDepositSum);

const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, cur) => (cur >= 1000 ? ++acc : acc), 0);

//.filter(mov => mov > 1000).length;

console.log(numDeposits1000);

const { depositss, withdrawalss } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sum, cur) => {
      sum[cur > 0 ? 'depositss' : 'withdrawalss'] += cur;
      return sum;
    },
    { depositss: 0, withdrawalss: 0 }
  );

console.log(depositss, withdrawalss);

const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(titleCase);
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not to long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(function (dog, i, arr) {
  dog.recFood = Math.trunc(dog.weight ** 0.75 * 28);
});

console.log(dogs);

const findDog = dogs.find(dog => dog.owners.includes('Sarah'));

const dogDiet = function (dog) {
  if (dog.curFood < 0.9 * dog.recFood) {
    return j.push(dog.owners);
  }
};

const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

console.log();

console.log(`${ownersEatTooMuch.join(' and ')}s dogs eat too much`);

//console.log(
const eatingOK = dog =>
  dog.curFood > 0.9 * dog.recFood && dog.curFood < 1.1 * dog.recFood;

console.log(dogs.filter(eatingOK));

const dogs2 = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(dogs2);


const dogDiett = function (dog) {
  j.map(dog => dog);
};
dogDiett(dogs);

console.log(j);
