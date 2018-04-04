let reject = require('lodash.reject');
let iframe = document.querySelector('.iframe');
let {ipcRenderer} = require('electron');

let prices = [];

let inProgress = false;
let bet = 1;
let MIN_BET = 5;
let TIME_BET = 5;

let oneSecondInMilliseconds = 1000;
let oneMinInMilliseconds = 60 * oneSecondInMilliseconds;
let tic = 25;
let ticInOneMin = oneMinInMilliseconds / tic;

let countMinutesBet = 5;
let countMinutesAnalize = 5;

let forceRelod = false;

let betLoseMap = {
  1: 2,
  2: 6,
  6: 18,
  18: 54,
  54: 'limit',
  'limit': 'limit',
}

let intervalIndeficator;

iframe.addEventListener('load', () => {
  setTimeout(() => {
    intervalIndeficator = setInterval(printPrice, tic);
    relodAfter(2 * 60 * oneMinInMilliseconds);
  }, 10 * oneSecondInMilliseconds)
});

let w = 0;
let l = 0;

async function printPrice () {
  let currentDate = new Date();
  let tab = getFromFrame('#pm-v1-EURUSD');
  if (!tab) {
    prices = [];
    return;
  } else if (!tab.classList.contains('pair-tab_selected')) {
      prices = [];
      return;
      tab.click();
  }
  if (forceRelod && (bet === 1 || bet === 'limit')) {
    clearInterval(intervalIndeficator);
    window.location.reload();
    return;
  }

  let day = currentDate.getDay();
  let hours = currentDate.getHours();

  if (bet === 1 || bet === 'limit') {
    if ((day === 1 && hours <= 10) ||
       (day === 5 && hours >= 9) ||
       (day === 6 || day === 0)) {
      prices = [];
      return;
    }
  }

  let priceText = getFromFrame('.pin_text');
  let curTime = getFromFrame('.timeinput__input.timeinput__input_minutes');

  if (!priceText) {
    prices = [];
    return;
  }

  let myPRISEE = parseFloat(getFromFrame('.sum.header-row__balance-sum').innerText.replace(' ', ''));
  let price = parseFloat(priceText.innerHTML);
  let incomeValue = parseInt(getFromFrame('.income__value').innerText);

  if (myPRISEE < 4700) {
    return;
  }
  let betType = analize(prices, incomeValue);
  prices.push(createTrainValue(price));
  if (prices.length > ticInOneMin * countMinutesAnalize) {
    prices = prices.slice(1);

    if (inProgress) {
      return;
    }

    let priceStartMy = prices[prices.length - 1];

    if (!betType) return;

    if (betType === 'up') {
      up();
    } else {
      down();
    }
    inProgress = true;

    setTimeout(() => {
      let p = parseFloat(getFromFrame('.user-deals-table.user-deals-table_turbo .user-deals-table__body').firstChild.children[3].innerText.trim());
      ipcRenderer.send('set-price-log', `${priceStartMy} ${p} ${priceStartMy === p} ${priceStartMy - p}`);
    }, 5000);

    setTimeout(async () => {
        let betInfo = getFromFrame('.user-deals-table__body').firstChild.children;
        let time = betInfo[2].innerText.trim().split('\n').join(" - ");
        let priceStart = `${betInfo[3].innerText.trim()}|${priceStartMy}`;
        let priceEnd = `${betInfo[4].innerText.trim()}|${prices[prices.length - 30]}`;
        let result = betInfo[8].innerText.trim();

        let betInPlatform = parseInt(getFromFrame('.input-currency input').value);

        addRow(betType, time, `${priceStart}|${priceEnd}`, result, betInPlatform, bet);
        if (result.indexOf('Прогноз не оправдался') !== -1) {
          bet = betLoseMap[bet];
          l++;
          w = 0;
        }

        if (result.indexOf('Прогноз оправдался') !== -1) {
          bet = 1;
          w++;
          l = 0;
        }

        await setBet(bet);

        inProgress = false;
    }, (oneMinInMilliseconds * countMinutesBet) + oneSecondInMilliseconds * 3);
  }
}

function relodAfter(time) {
  setTimeout(() => {
    forceRelod = true;
  }, time)
}

async function setBet (bet = 1) {
  // return;
  let current = parseInt(getFromFrame('.input-currency input').value);
  let myBet = bet * MIN_BET || MIN_BET;

  if (myBet === current) {
    return;
  }

  let count = Math.abs(myBet - current) / MIN_BET;
  if (myBet > current) {
    while (myBet !== current) {
      await upAmount();
      current = parseInt(getFromFrame('.input-currency input').value);
    }
  } else {
    while (myBet !== current) {
      await downAmount();
      current = parseInt(getFromFrame('.input-currency input').value);
    }
  }
}

function upAmount () {
  return new Promise((res) => {
    window.requestAnimationFrame(() => {
      iframe
        .contentDocument
        .querySelector('[data-test="deal-select-amount-up"]')
        .click();

        window.requestAnimationFrame(() => {
          res();
        });
    });

  });
}

function downAmount () {
  return new Promise((res) => {
      window.requestAnimationFrame(() => {
        iframe
          .contentDocument
          .querySelector('[data-test="deal-select-amount-down"]')
          .click();

          window.requestAnimationFrame(() => {
            res();
          });
      });
  });
}

async function setTime (time = TIME_BET) {
  let curTime = parseInt(getFromFrame('.timeinput__input.timeinput__input_minutes')
    .value);
  if (curTime < time) {
    await upTime()
  } else {
    await downTime()
  }
}

function upTime () {
  return new Promise((res) => {
      iframe
        .contentDocument
        .querySelector('[data-test="deal-select-duration-up"]')
        .click();
    window.requestAnimationFrame(() => {
      res();
    });
  });
}

function downTime () {
  return new Promise((res) => {
      iframe
        .contentDocument
        .querySelector('[data-test="deal-select-duration-down"]')
        .click();
    window.requestAnimationFrame(() => {
      res();
    });
  });
}

function up (bet = 1) {
  getFromFrame('[data-test="deal-button-up"]').click()
}

function down (bet = 1) {
  getFromFrame('[data-test="deal-button-down"]').click()
}

function addRow (betType, time, priceStart, priceEnd, res, bet) {
  ipcRenderer.send('asynchronous-reply', `${betType}|${time}|${priceStart}|${priceEnd}|${res}|${bet}`);
}

function createTrainValue (val, date) {
  return val;
}

function getFromFrame (selector) {
  return iframe.contentDocument.querySelector(selector);
}


function analize (arr, incomeValue) {
  if (incomeValue < 70) {
    return null;
  }

  arr = reject(arr, function (v, i) {
      return i > 0 && arr[i - 1] === v;
  });
  let countMore = 0;
  let countLess = 0;

  for (var i = 0; i < arr.length; i++) {
  	for (var j = i; j < arr.length; j++) {
  		if (arr[i] < arr[j]) countMore++;
      if (arr[i] > arr[j]) countLess++;
  	}
  }

  let unstableCoefficient = (Math.min(countMore, countLess) || 1) / Math.max(countMore, countLess);
  let isUnstable = unstableCoefficient > 0.3;
  // console.log(unstableCoefficient, countMore, countLess, arr.length);

  if (isUnstable) return null;

  let result = arr[0] > arr[arr.length - 1]
    ? 'down'
    : 'up';

  if (l && l%2 === 0) {
    return result === 'up'
      ? 'down'
      : 'up';
  }

  return result;

}
