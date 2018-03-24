const iframe = document.querySelector('.iframe');
const {ipcRenderer} = require('electron');

iframe.addEventListener('load', () => {
  setInterval(printPrice, 500);
  stopWorkAfter(3 * 60 * 60 * 1000);
  ipcRenderer.send('clear-log');

});

let prices = [];

let inProgress = false;
let stopWork = false;
let bet = 1;

const betLoseMap = {
  1: 2,
  2: 6,
  6: 1,
}

async function printPrice () {
  if (stopWork) {
    return;
  }
  const price = iframe.contentDocument.querySelector('.pin_text').innerHTML;
  prices.push(createTrainValue(parseFloat(price)));

  const betType = analize(prices);
  if (prices.length > 60 * 2) {
    prices = prices.slice(1);

    if (inProgress) {
      return;
    }

    if (!betType) return;
    await setBet(bet);
    if (betType === 'up') {
      up();
    } else {
      down();
    }

    console.log('beeeeet!!!', betType);

    const priceStartMy = prices[prices.length - 1];
    inProgress = true;
    setTimeout(() => {
        const betInfo = iframe.contentDocument.querySelector('.user-deals-table__body').firstChild.children;
        const time = betInfo[2].innerText.trim().split('\n').join(" - ");
        const priceStart = `${betInfo[3].innerText.trim()}|${priceStartMy}`;
        const priceEnd = `${betInfo[4].innerText.trim()}|${prices[prices.length - 1]}`;
        const result = betInfo[8].innerText.trim();

        addRow(betType, time, priceStart, priceEnd, result, bet);
        inProgress = false;
        if (result.indexOf('Прогноз не оправдался') !== -1) {
          bet = betLoseMap[bet];

          console.log('Прогноз не оправдался, следующая ставка', bet);
        }

        if (result.indexOf('Прогноз оправдался') !== -1) {

          console.log('Прогноз оправдался', bet, 'следующаяставка 1');
          bet = 1;
        }
    }, 70000)
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
    setTimeout(() => res(), time);
  });
}

function up (bet = 1) {
  iframe.contentDocument.querySelector('[data-test="deal-button-up"]').click()
}

function down (bet = 1) {
  iframe.contentDocument.querySelector('[data-test="deal-button-down"]').click()
}

function addRow (betType, time, priceStart, priceEnd, res, bet) {
  const table = document.querySelector('.table');

  const result = {
    row: document.createElement('tr'),
    betType: document.createElement('th'),
    time: document.createElement('th'),
    priceStart: document.createElement('th'),
    priceEnd: document.createElement('th'),
    result: document.createElement('th'),
  };

  result.betType.innerHTML = betType;
  result.time.innerHTML = time;
  result.priceStart.innerHTML = priceStart;
  result.priceEnd.innerHTML = priceEnd;
  result.result.innerHTML = res;

  result.row.appendChild(result.betType);
  result.row.appendChild(result.time);
  result.row.appendChild(result.priceStart);
  result.row.appendChild(result.priceEnd);
  result.row.appendChild(result.result);


  ipcRenderer.send('asynchronous-reply', `${betType}|${time}|${priceStart}|${priceEnd}|${res}|${bet}`);

  // table.appendChild(result.row);
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

  // if (isUnstable) return null;

  return arr[0] > arr[arr.length - 1]
    ? 'down'
    : 'up';

}
