function processFile(inputFile, onLine, onClose = () => {}) {
    var fs = require('fs'),
        readline = require('readline'),
        instream = fs.createReadStream(inputFile),
        outstream = new (require('stream'))(),
        rl = readline.createInterface(instream, outstream);

    rl.on('line', onLine);

    rl.on('close', onClose);
}
processFile('1', read, analize);

const prices = [];
const incoming = [];
function read (line) {
  prices.push(line);

}

const step = 63 * 10 * 5;

function analize () {
  let arr = [];
  let wins = 0;

  for (var i = 0; i < prices.length / (step); i++) {
  // for (var i = 0; i < 10; i++) {

    arr = prices.slice(i * step, i * step + step);
    arr = arr.splice(0, step - 30);
    // if (arr.length <= step) continue;
    // console.log(arr.length);



    var {bet, unstableCoefficient} = analizePrices(arr.map(parseFloat));
    // console.log(unstableCoefficient);
    i++;
    arr = prices.slice(i * step, i * step + step);
    arr = arr.splice(0, step - 30);

    var [price, inc] = arr[0].split(' ');

    // if (bet && inc >= 70) {
    if (bet) {

      let result;

      if (bet === 'up') {
        result = parseFloat(arr[0]) < parseFloat(arr[arr.length - 1])
          ? 1
          : -1;
      } else {
        result = parseFloat(arr[0]) > parseFloat(arr[arr.length - 1])
          ? 1
          : -1;
      }

      wins += result;

      console.log(result, bet, unstableCoefficient, i, parseFloat(arr[0]) - parseFloat(arr[arr.length - 1]));
      // console.log(result);

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
