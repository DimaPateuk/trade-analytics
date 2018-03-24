function processFile(inputFile, onLine, onClose) {
    var fs = require('fs'),
        readline = require('readline'),
        instream = fs.createReadStream(inputFile),
        outstream = new (require('stream'))(),
        rl = readline.createInterface(instream, outstream);

    rl.on('line', onLine);

    rl.on('close', onClose);
}
processFile('log4.txt', analize, printResult);

const rate = 1.7;
let win = 0;
let lose = 0;

let lresult = 0;
let l = 0;
let moreThenTreeFail = 0;
let info = {};

let R = 0;
function analize (line) {
  if (line.indexOf('Прогноз не оправдался') !== -1) {
    // console.log('-1');
    R += parseInt(line.split('|')[6]) * -1;
    // console.log(R);
    lose++;
    l++;
    if (l%3 === 0) {
      moreThenTreeFail++;
    }
    if (lresult < l) {
      lresult = l;
    }
  }

  if (line.indexOf('Прогноз оправдался') !== -1) {
    // console.log('1');
    win++;
      R += parseInt(line.split('|')[6]) * rate;
    l &&(info[l] = info[l] ? info[l] + 1 : 1);
    l = 0;
    // console.log(R);
  }

}
const minBet = 5;
var pricesA = {
  1: 2*minBet * rate - minBet,
  2: 6*minBet * rate - 3*minBet,
  3: 1*minBet * rate - 9*minBet,
  4: 2*minBet * rate - 10*minBet,
  5: 6*minBet * rate - 12*minBet,
  6: 1*minBet * rate - 18*minBet,
  7: 2*minBet * rate - 19*minBet,
  8: 6*minBet * rate - 21*minBet,
  9: 1*minBet * rate - 27*minBet,
  10: 2*minBet * rate - 28*minBet,
}

var pricesB = {
  1: 2*minBet * rate - minBet,
  2: 6*minBet * rate - 3*minBet,
  3: 1*minBet * rate - 9*minBet,
  4: 1*minBet * rate - 10*minBet,
  5: 1*minBet * rate - 11*minBet,
  6: 1*minBet * rate - 12*minBet,
  7: 1*minBet * rate - 13*minBet,
  8: 1*minBet * rate - 14*minBet,
  9: 1*minBet * rate - 15*minBet,
  10: 1*minBet * rate - 16*minBet,
}

// console.log(prices);

function printResult () {
  console.log(win, lose, lresult);
  console.log(info);

  printPrices(pricesA);
  // printPrices(pricesB);

    // console.log(R);
}
function printPrices(prices) {
  const result = Object.keys(info)
    .map(v => parseInt(v))
    .reduce((res, val) => {
      console.log(info[val], prices[val]);
      if (!prices[val]) return res;
      return res + info[val] * prices[val];
    }, 0);
    console.log(result);
} 