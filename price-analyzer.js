function processFile(inputFile, onLine, onClose = () => {}) {
    var fs = require('fs'),
        readline = require('readline'),
        instream = fs.createReadStream(inputFile),
        outstream = new (require('stream'))(),
        rl = readline.createInterface(instream, outstream);

    rl.on('line', onLine);

    rl.on('close', onClose);
}
processFile('price-log-Mon Mar 26 2018 14-44-54 GMT+0300 (Belarus Standard Time)', read, analize);

const prices = [];
function read (line) {
  const price = parseFloat(line);
  prices.push(price);
}

function analize () {
  let arr = [];
  let wins = 0;
  for (var i = 0; i < prices.length - 60 * 10; i++) {
    arr.push(prices[i]);

    if (arr.length < 60 * 10) continue;

    var bet = analizePrices(arr);
    if (bet) {
      let result;
      if (bet === 'up') {
        result = prices[i] < prices[i + 60 * 10]
          ? 1
          : -1;
      } else {
        result = prices[i] > prices[i + 60 * 10]
          ? 1
          : -1;
      }
      wins += result;
      console.log(wins);
      
    }

    if (arr.length > 60 * 10 * 1) {
      arr = arr.slice(1);
    }
  }

}

function analizePrices (arr) {
  arr = arr.map(v => v * 100);
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
