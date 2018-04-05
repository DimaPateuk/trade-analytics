function processFile(inputFile, onLine, onClose) {
    var fs = require('fs'),
        readline = require('readline'),
        instream = fs.createReadStream(inputFile),
        outstream = new (require('stream'))(),
        rl = readline.createInterface(instream, outstream);

    rl.on('line', onLine);

    rl.on('close', onClose);
}
processFile('log2-loose.txt', analize, printResult);

const rate = 0.7;
let win = 0;
let lose = 0;

let lresult = 0;
let l = 0;
let moreThenTreeFail = 0;
let info = {};
let infoWin = {};
let myBETS = [];
let w = 0;



let startTreadeFrom = 0;
function analize (line) {
  let betTimeStart = +new Date(line.split('|')[1].split(' - ')[0]);
  let betTimeEnd = +new Date(line.split('|')[1].split(' - ')[1]);
  console.log((betTimeStart - startTreadeFrom)/ (60*1000))
  if (betTimeStart < startTreadeFrom) {

    return;
  }

  if (line.indexOf('Прогноз не оправдался') !== -1) {
    // console.log('-1');

    lose++;
    l++;
    infoWin[w] = infoWin[w] ? infoWin[w] + 1 : 1;
    w = 0;
    if (l && l%2 === 0) {
      startTreadeFrom = betTimeEnd + 5 * 60 * 1000;
    }
  }

  if (line.indexOf('Прогноз оправдался') !== -1) {
    // console.log('1');

    win++;
    w++;
    info[l] = info[l] ? info[l] + 1 : 1;
    l = 0;
  }

}
const minBet = 1;

// var pricesA = {
//   0: minBet * rate,
//   1: 2*minBet * rate - minBet,
//   2: 6*minBet * rate - 3*minBet,
//   3: 18*minBet * rate - 9*minBet,
//   4: 1*minBet * rate - 27*minBet,
//   5: 1*minBet * rate - 28*minBet,
//   6: 1*minBet * rate - 29*minBet,
//   7: 1*minBet * rate - 30*minBet,
//   8: 1*minBet * rate - 31*minBet,
//   9: 1*minBet * rate - 32*minBet,
//   10: 1*minBet * rate - 33*minBet,
// };

var pricesA = {
  0: minBet * rate,
  1: 2*minBet * rate - minBet,
  2: 6*minBet * rate - 3*minBet,
  3: 18*minBet * rate - 9*minBet,
  4: 54*minBet * rate - 27*minBet,
  5: 1*minBet * rate - 81*minBet,
  6: 1*minBet * rate - 82*minBet,
  7: 1*minBet * rate - 83*minBet,
  8: 1*minBet * rate - 84*minBet,
  9: 1*minBet * rate - 85*minBet,
  10: 1*minBet * rate - 86*minBet,
};


// var pricesA = {
//   0: minBet * rate,
//   1: 2*minBet * rate - minBet,
//   2: 6*minBet * rate - 3*minBet,
//   3: 18*minBet * rate - 9*minBet,
//   4: 54*minBet * rate - 27*minBet,
//   5: 162*minBet * rate - 81*minBet,
//   6: 1*minBet * rate - 243*minBet,
//   7: 1*minBet * rate - 244*minBet,
//   8: 1*minBet * rate - 245*minBet,
//   9: 1*minBet * rate - 246*minBet,
//   10: 1*minBet * rate - 247*minBet,
// };




let howMutchIHaveToSet = {
  0: minBet,
  1: 2*minBet,
  2: 6*minBet,
  3: 18*minBet,
  4: 54*minBet,
}
// console.log(pricesA);
// console.log(howMutchIHaveToSet);


function printResult () {
  // console.log(win, lose, lresult);
  console.log(info);
  // console.log(infoWin);

  printPrices(pricesA);

}
function printPrices(prices) {
  let result = Object.keys(info)
    .map(v => {
      return parseInt(v)
    })
    .reduce((res, val) => {
      if (!prices[val]) return res;
      return res + info[val] * prices[val];
    }, 0);

    console.log(result);
}
