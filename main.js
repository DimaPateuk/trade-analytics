const iframe = document.querySelector('.iframe');
const {ipcRenderer} = require('electron');

iframe.addEventListener('load', () => {
  setInterval(printPrice, 100);
  // stopWorkAfter(2 * 60 * 60 * 1000);
  // ipcRenderer.send('clear-log');

});

let prices = [];

let inProgress = false;
let stopWork = false;
let bet = 1;

let countMinutesBet = 1;
let countMinutesAnalize = 1;

const betLoseMap = {
  1: 2,
  2: 6,
  6: 18,
  18: 54,
  54: 'limit',
  'limit': 'limit',
}
let setBetInProgress = false;
async function printPrice () {
  const myPRISEE = parseFloat(iframe.contentDocument.querySelector('.sum.header-row__balance-sum').innerText.split(' ').join(''));
  const price = parseFloat(iframe.contentDocument.querySelector('.pin_text').innerHTML);
  ipcRenderer.send('price-log', price);
  console.log(price);
  if (setBetInProgress) {
    return;
  }
  // console.log(myPRISEE);
  if (myPRISEE < 7000) {
    return;
  }
  if (stopWork) {
    return;
  }
  prices.push(createTrainValue(price));

  // const betType = analize(prices);
  if (prices.length > 60 * 10 * countMinutesAnalize) {
    prices = prices.slice(1);
    return;

    if (inProgress) {
      return;
    }

    if (!betType) return;
    setBetInProgress = true;
    // await setBet(bet);
    if (betType === 'up') {
      up();
    } else {
      down();
    }

    console.log('beeeeet!!!', betType);

    const priceStartMy = prices[prices.length - 1];
    inProgress = true;
    setBetInProgress = false;
    setTimeout(() => {
        const betInfo = iframe.contentDocument.querySelector('.user-deals-table__body').firstChild.children;
        const time = betInfo[2].innerText.trim().split('\n').join(" - ");
        const priceStart = `${betInfo[3].innerText.trim()}|${priceStartMy}`;
        const priceEnd = `${betInfo[4].innerText.trim()}|${prices[prices.length - 1]}`;
        const result = betInfo[8].innerText.trim();

        const betInPlatform = parseInt(iframe.contentDocument.querySelector('.input-currency input').value);

        addRow(betType, time, priceStart, result, betInPlatform, bet);
        inProgress = false;
        if (result.indexOf('Прогноз не оправдался') !== -1) {
          bet = betLoseMap[bet];

          console.log('Прогноз не оправдался, следующая ставка', bet);
        }

        if (result.indexOf('Прогноз оправдался') !== -1) {

          console.log('Прогноз оправдался', bet, 'следующаяставка 1');
          bet = 1;
        }
    }, (60000 * countMinutesBet) + 3000)
  }
}

function stopWorkAfter(time) {
  setTimeout(() => {
    stopWork = true;
  }, time)
}

let betMapPriceValue = {
  1: 5,
  2: 10,
  6: 30,
  18: 90,
  54: 270,
  'limit': 5,
}
async function setBet (bet = 1) {
  let current = parseInt(iframe.contentDocument.querySelector('.input-currency input').value);

  if (betMapPriceValue[bet] === current) {
    return;
  }

  const count = Math.abs(betMapPriceValue[bet] - current) / 5;
  if (betMapPriceValue[bet] > current) {
    while (betMapPriceValue[bet] !== current) {
      await upAmount();
      current = parseInt(iframe.contentDocument.querySelector('.input-currency input').value);
    }
  } else {
    while (betMapPriceValue[bet] !== current) {
      await downAmount();
      current = parseInt(iframe.contentDocument.querySelector('.input-currency input').value);
    }
  }
}
window.f = setBet;

function upAmount () {
  return new Promise((res) => {
    window.requestAnimationFrame(() => {
      iframe
        .contentDocument
        .querySelector('[data-test="deal-select-amount-up"]')
        .click();
      setTimeout(() => res(), 50);
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
      setTimeout(() => res(), 50);
    });
  });
}

function awaitTime (time = 100) {
  return new Promise((res) => {
    window.requestAnimationFrame(() => {
      setTimeout(() => res(), time);
    });
  });
}

function up (bet = 1) {
  iframe.contentDocument.querySelector('[data-test="deal-button-up"]').click()
}

function down (bet = 1) {
  iframe.contentDocument.querySelector('[data-test="deal-button-down"]').click()
}

function addRow (betType, time, priceStart, priceEnd, res, bet) {
  ipcRenderer.send('asynchronous-reply', `${betType}|${time}|${priceStart}|${priceEnd}|${res}|${bet}`);
}

function createTrainValue (val, date) {
  return val;
  // return {
  //   input: [date || +new Date],
  //   output: [val],
  // }
}


function analize (arr) {
  if (parseInt(iframe.contentDocument.querySelector('.income__value').innerText) < 70) {
    console.log(iframe.contentDocument.querySelector('.income__value'));
    return null;
  }
  arr = arr.map(v => v * 100000);
  let countMore = 0;
  let countLess = 0;

  for (var i = 0; i < arr.length; i++) {
  	for (var j = i; j < arr.length; j++) {
  		if (arr[i] < arr[j]) countMore++;
      if (arr[i] > arr[j]) countLess++;
  	}
  }

  const unstableCoefficient = (Math.min(countMore, countLess) || 1) / Math.max(countMore, countLess);
  const isUnstable = unstableCoefficient > 0.3;
  console.log(unstableCoefficient, countMore, countLess, arr.length);

  if (isUnstable) return null;

  return arr[0] > arr[arr.length - 1]
    ? 'down'
    : 'up';

}
// { '0': 8, '1': 6, '2': 2, '3': 2, '4': 1 }
