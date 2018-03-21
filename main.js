const iframe = document.querySelector('.iframe');

iframe.addEventListener('load', () => {
  setInterval(printPrice, 1000);
});

let prices = [];

let inProgress = false;
function printPrice () {
  const price = iframe.contentDocument.querySelector('.pin_text').innerHTML;
  prices.push(createTrainValue(parseFloat(price)));

  if (prices.length > 60) {
    prices = prices.slice(1);

    if (inProgress) {
      return;
    }

    const betType = analize(prices);

    if (!betType) return;

    // if (betType === 'up') {
    //   up();
    // } else {
    //   down();
    // }

    const priceStart = prices[prices.length - 1];
    const time = new Date;
    inProgress = true;
    setTimeout(() => {
        addRow(betType, time, priceStart, prices[prices.length - 1]);
        inProgress = false;
    }, 60000)
  }
}


function up () {
  iframe.contentDocument.querySelector('[data-test="deal-button-up"]').click()
}

function down () {
  iframe.contentDocument.querySelector('[data-test="deal-button-down"]').click()
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

function createTrainValue (val, date) {
  return val;
  // return {
  //   input: [date || +new Date],
  //   output: [val],
  // }
}


function analize (arr) {

  let countMore = 0;
  let countLess = 0;

  for (var i = 0; i < arr.length; i++) {
	for (var j = i; j < arr.length; j++) {
		if (arr[i] < arr[j]) countMore++;
        if (arr[i] > arr[j]) countLess++;
	}
  }


    const isUnstable = (Math.min(countMore, countLess) || 1) / Math.max(countMore, countLess);
    console.log(isUnstable, countMore, countLess);
    if (isUnstable > 0.3) return null;

  return arr[0] > arr[arr.length - 1]
    ? 'down'
    : 'up';

}
