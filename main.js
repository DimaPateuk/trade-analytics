const iframe = document.querySelector('.iframe');
const {ipcRenderer} = require('electron');

iframe.addEventListener('load', () => {
  setInterval(printPrice, 25);
  relodAfter(4 * 60 * 60 * 1000);
  // stopWorkAfter(2 * 60 * 60 * 1000);
  // ipcRenderer.send('clear-log');

});

let prices = [];

let inProgress = false;
let stopWork = false;
let bet = 1;

let countMinutesBet = 5;
let countMinutesAnalize = 5;

let forceRelod = false;

const betLoseMap = {
  1: 2,
  2: 6,
  6: 18,
  18: 54,
  54: 'limit',
  'limit': 'limit',
}

async function printPrice () {
  const myPRISEE = parseFloat(iframe.contentDocument.querySelector('.sum.header-row__balance-sum').innerText.split(' ').join(''));
  const price = parseFloat(iframe.contentDocument.querySelector('.pin_text').innerHTML);
  const incomeValue = parseInt(iframe.contentDocument.querySelector('.income__value').innerText);
  // ipcRenderer.send('price-log', `${price} ${incomeValue}`);

  // console.log(myPRISEE);
  if (myPRISEE < 6000) {
    return;
  }
  if (stopWork) {
    return;
  }
  prices.push(createTrainValue(price));

  const betType = analize(prices);
  if (prices.length > 60 * 40 * countMinutesAnalize) {
    prices = prices.slice(1);
    const priceStartMy = prices[prices.length - 1];

    if (inProgress) {
      return;
    }

    if (!betType) return;

    if (betType === 'up') {
      up();
    } else {
      down();
    }
    inProgress = true;
    setTimeout(() => {

      const p = parseFloat(iframe.contentDocument.querySelector('.user-deals-table.user-deals-table_turbo .user-deals-table__body').firstChild.children[3].innerText.trim());
      ipcRenderer.send('set-price-log', `${priceStartMy} ${p} ${priceStartMy === p} ${priceStartMy - p}`);

      console.log('beeeeet!!!', betType, priceStartMy, p, priceStartMy === p);
    }, 5000);
    setTimeout(async () => {
        const betInfo = iframe.contentDocument.querySelector('.user-deals-table__body').firstChild.children;
        const time = betInfo[2].innerText.trim().split('\n').join(" - ");
        const priceStart = `${betInfo[3].innerText.trim()}|${priceStartMy}`;
        const priceEnd = `${betInfo[4].innerText.trim()}|${prices[prices.length - 30]}`;
        const result = betInfo[8].innerText.trim();

        const betInPlatform = parseInt(iframe.contentDocument.querySelector('.input-currency input').value);

        addRow(betType, time, `${priceStart}|${priceEnd}`, result, betInPlatform, bet);
        if (result.indexOf('Прогноз не оправдался') !== -1) {
          bet = betLoseMap[bet];

          console.log('Прогноз не оправдался, следующая ставка', bet);
        }

        if (result.indexOf('Прогноз оправдался') !== -1) {

          console.log('Прогноз оправдался', bet, 'следующаяставка 1');
          bet = 1;
          if (forceRelod) {
            await setBet(bet);
            window.location.reload();
            return;
          }
        }
        await setBet(bet);
        inProgress = false;
    }, (60000 * countMinutesBet) + 3000);
  }
}

function stopWorkAfter(time) {
  setTimeout(() => {
    stopWork = true;
  }, time)
}
function relodAfter(time) {
  setTimeout(() => {
    forceRelod = true;
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
  // console.log(unstableCoefficient, countMore, countLess, arr.length);

  if (isUnstable) return null;

  return arr[0] > arr[arr.length - 1]
    ? 'down'
    : 'up';

}
