const iframe = document.querySelector('.iframe');

iframe.addEventListener('load', () => {
  setInterval(printPrice, 1000);
});

let prices = [];

let inProgress = false;
function printPrice () {
  const price = iframe.contentDocument.querySelector('.pin_text').innerHTML;
  prices.push(parseFloat(price));

  if (prices.length > 60) {
    prices = prices.slice(1);

    if (inProgress) {
      return;
    }

    const betType = prices[0] > prices[prices.length - 1]
      ? 'down'
      : 'up';
    const priceStart = prices[prices.length - 1];
    const time = new Date;
    inProgress = true;
    setTimeout(() => {
        addRow(betType, time, priceStart, prices[prices.length - 1]);
        inProgress = false;
    }, 60000)
  }
}

function addRow (betType, time, priceStart, priceEnd) {
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

  if (priceStart === priceEnd) {
    result.result.innerHTML = 'none';
  } else if (betType === 'up') {
    result.result.innerHTML = priceStart < priceEnd ? 'win' : 'lose';
  } else {
    result.result.innerHTML = priceStart > priceEnd ? 'win' : 'lose';
  }

  result.row.appendChild(result.betType);
  result.row.appendChild(result.time);
  result.row.appendChild(result.priceStart);
  result.row.appendChild(result.priceEnd);
  result.row.appendChild(result.result);

  table.appendChild(result.row);
}
