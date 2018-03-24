function processFile(inputFile, onLine, onClose) {
    var fs = require('fs'),
        readline = require('readline'),
        instream = fs.createReadStream(inputFile),
        outstream = new (require('stream'))(),
        rl = readline.createInterface(instream, outstream);

    rl.on('line', onLine);

    rl.on('close', onClose);
}
processFile('log2.txt', analize, printResult);

let win = 0;
let lose = 0;

let lresult = 0;
let l = 0;
let moreThenTreeFail = 0;
let info = {};

let R = 0;
function analize (line) {
  if (line.indexOf('Прогноз не оправдался') !== -1) {
    // console.log(R);
    R += parseInt(line.split('|')[6]) * -1;
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
    win++;
      R += parseInt(line.split('|')[6]) * 1.8;
    info[l] = info[l] ? info[l] + 1 : 1;
    l = 0;
    // console.log(R);
  }

}
const minBet = 1;
var pricesA = {
  0: minBet * 1.8,
  1: 2*minBet * 1.8 - minBet,
  2: 6*minBet * 1.8 - 3*minBet,
  3: 1*minBet * 1.8 - 9*minBet,
  4: 2*minBet * 1.8 - 10*minBet,
  5: 6*minBet * 1.8 - 12*minBet,
  6: 1*minBet * 1.8 - 18*minBet,
  7: 2*minBet * 1.8 - 19*minBet,
  8: 6*minBet * 1.8 - 21*minBet,
  9: 1*minBet * 1.8 - 27*minBet,
  10: 2*minBet * 1.8 - 28*minBet,
}

var pricesB = {
  0: minBet * 1.8,
  1: 2*minBet * 1.8 - minBet,
  2: 6*minBet * 1.8 - 3*minBet,
  3: 1*minBet * 1.8 - 9*minBet,
  4: 1*minBet * 1.8 - 10*minBet,
  5: 1*minBet * 1.8 - 11*minBet,
  6: 1*minBet * 1.8 - 12*minBet,
  7: 1*minBet * 1.8 - 13*minBet,
  8: 1*minBet * 1.8 - 14*minBet,
  9: 1*minBet * 1.8 - 15*minBet,
  10: 1*minBet * 1.8 - 16*minBet,
}

// console.log(prices);

function printResult () {
  // console.log(win, lose, lresult, moreThenTreeFail, info);
  console.log(info);

  printPrices(pricesA);
  printPrices(pricesB);

    // console.log(R);
}
function printPrices(prices) {
  const result = Object.keys(info)
    .map(v => parseInt(v))
    .reduce((res, val) => {
      // console.log(info[val], prices[val]);
      if (!prices[val]) return res;
      return res + info[val] * prices[val];
    }, 0);
    console.log(result);
}