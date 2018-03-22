const iframe = document.querySelector('.iframe');

iframe.addEventListener('load', () => {
  setInterval(printPrice, 500);
});

let prices = [];

let inProgress = false;
function printPrice () {
  const price = iframe.contentDocument.querySelector('.pin_text').innerHTML;
  prices.push(createTrainValue(parseFloat(price)));

  const betType = analize(prices);
  if (prices.length > 60 * 2 * 5) {
    prices = prices.slice(1);

    if (inProgress) {
      return;
    }


    if (!betType) return;

    if (betType === 'up') {
      up();
    } else {
      down();
    }

    console.log('beeeeet!!!', betType);

    const priceStartMy = prices[prices.length - 1];
    const time = new Date;
    inProgress = true;
    setTimeout(() => {
        const betInfo = iframe.contentDocument.querySelector('.user-deals-table__body').firstChild.children;
        const time = betInfo[2].innerText
        const priceStart = `${betInfo[3].innerText} - ${priceStartMy}`;
        const priceEnd = `${betInfo[4].innerText} - ${prices[prices.length - 1]}`;
        const result = betInfo[8].innerText;

        addRow(betType, time, priceStart, priceEnd, result);
        inProgress = false;
    }, 61000 * 5)
  }
}


function up () {
  iframe.contentDocument.querySelector('[data-test="deal-button-up"]').click()
}

function down () {
  iframe.contentDocument.querySelector('[data-test="deal-button-down"]').click()
}

function addRow (betType, time, priceStart, priceEnd, res) {
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
  arr = arr.map(v => v * 100000);
  let countMore = 0;
  let countLess = 0;

  for (var i = 0; i < arr.length; i++) {
  	for (var j = i; j < arr.length; j++) {
  		if (arr[i] < arr[j]) countMore++;
      if (arr[i] > arr[j]) countLess++;
  	}
  }

  let averageJump = 0

  for (var i = 0; i < arr.length - 1; i++) {
    averageJump += (arr[i] - arr[i + 1]) * -1;
  }

  averageJump /= arr.length;

  averageJump = Math.abs(averageJump);


  const lastJumps = [
    (arr[arr.length - 1] - arr[arr.length - 2]) * -1,
    (arr[arr.length - 2] - arr[arr.length - 3]) * -1,
  ];

  const unstableCoefficient = (Math.min(countMore, countLess) || 1) / Math.max(countMore, countLess);
  const isUnstable = unstableCoefficient > 0.3;
  console.log(unstableCoefficient, countMore, countLess, arr.length);


  // console.log(averageJump, lastJumps);
  //
  // if (lastJumps.every(val => val < 0 && Math.abs(val) > averageJump * 2))  {
  //   return 'down';
  // }
  //
  // if (lastJumps.every(val => val > 0 && Math.abs(val) > averageJump * 2))  {
  //   return 'up';
  // }
  //
  // return null;


  if (isUnstable) return null;

  return arr[0] > arr[arr.length - 1]
    ? 'down'
    : 'up';

}
