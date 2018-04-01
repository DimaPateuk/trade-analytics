function processFile(inputFile, onLine, onClose = () => {}) {
    var fs = require('fs'),
        readline = require('readline'),
        instream = fs.createReadStream(inputFile),
        outstream = new (require('stream'))(),
        rl = readline.createInterface(instream, outstream);

    rl.on('line', onLine);

    rl.on('close', onClose);
}
processFile('prices/log-price-Sat Mar 31 2018 06-05-29 GMT+0300 (Belarus Standard Time)', read, analize);

let prices = [];
function read (line) {
  prices.push(line);

}

const step = 63 * 40 * 5;

function analize () {
  let arr = [];
  let wins = 0;
  // prices = prices.slice(0, 100000);
  for (var i = 0; i < prices.length - 2 * step - 3 * 40 - 1; i++) {
  // for (var i = 0; i < 10; i++) {
    // console.log(i);

    arr = prices.slice(i, i + step - 3 * 40);
    var [price, inc] = arr[arr.length - 1].split(' ');
    
    // console.log(inc);
    if (parseFloat(inc) >= 70) {
      continue;
    }
    var {bet, unstableCoefficient} = analizePrices(arr.map(parseFloat));

    // console.log(unstableCoefficient, inc);

    if (bet) {
    // if (bet) {

      i += step;
      arr = prices.slice(i + step - 3 * 40, i + 2 * step - 3 * 40);
      arr = arr.splice(0, step - 3 * 40);
      let result;
      let price0 = parseFloat(arr[0].split(' ')[0]);
      let price1 = parseFloat(arr[arr.length - 1].split(' ')[0]);

      if (bet === 'up') {
        result = price0 < price1
          ? 1
          : -1;
      } else {
        result = price0 > price1
          ? 1
          : -1;
      }

      wins += result;

      console.log('remove', result, bet, unstableCoefficient, i, price0 - price1);
      console.log(result);

      // console.log(
      //   result === -1
      //     ? 'Прогноз оправдался'
      //     : 'Прогноз не оправдался'
      // );

    }
  }

}

let qwe = 'down';

function analizePrices (arr) {

  let countMore = 0;
  let countLess = 0;
  for (var i = 0; i < arr.length; i++) {
    // console.log(arr[i]);
  	for (var j = i; j < arr.length; j++) {
  		if (arr[i] < arr[j]) countMore++;
      if (arr[i] > arr[j]) countLess++;
  	}
  }

  const unstableCoefficient = (Math.min(countMore, countLess) || 1) / Math.max(countMore, countLess);
  const isUnstable = unstableCoefficient > 0.3;
  // console.log(unstableCoefficient, countMore, countLess, arr.length);
  // console.log(unstableCoefficient);

  if (isUnstable) return {unstableCoefficient};

  return {
      bet: arr[0] > arr[arr.length - 1]
        ? 'down'
        : 'up',
      unstableCoefficient, countMore, countLess
  };

}
