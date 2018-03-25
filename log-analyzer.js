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
let bets = [];
function analize (line) {
  const brtMy = parseInt(line.split("|")[line.split("|").length - 1]);
  if (line.indexOf('Прогноз не оправдался') !== -1) {
    console.log(-brtMy || -1);
    bets.push(parseInt(line[line.length - 1]) * -1);
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
    console.log(brtMy|| 1);
    bets.push(parseInt(line[line.length - 1]));
    // console.log('1');
    win++;
      R += parseInt(line.split('|')[6]) * rate;
    info[l] = info[l] ? info[l] + 1 : 1;
    l = 0;
    // console.log(R);
  }

}
const minBet = 5;
var pricesA = {
  0: minBet * rate,
  1: 2*minBet * rate - minBet - 2*minBet,
  2: 6*minBet * rate - 3*minBet - 6*minBet,
  3: 18*minBet * rate - 9*minBet - 18*minBet,
  4: 54*minBet * rate - 27*minBet - 54*minBet,
  5: 1*minBet * rate - 28*minBet - 1*minBet,
  6: 1*minBet * rate - 29*minBet - 1*minBet,
  7: 1*minBet * rate - 30*minBet - 1*minBet,
  8: 1*minBet * rate - 31*minBet - 1*minBet,
  9: 1*minBet * rate - 32*minBet - 1*minBet,
  10: 1*minBet * rate - 33*minBet - 1*minBet,
}

console.log(pricesA);

function isRightBets (bets) {
  for (var i = 0; i < bets.length - 1; i++) {
    if (bets[i] === -1 && (bets[i + 1] === -2 || bets[i + 1] === 2)) {
      continue;
    }
    if (bets[i] === -2 && (bets[i + 1] === -6 || bets[i + 1] === 6)) {
      continue;
    }

    if (bets[i] === -6 && (bets[i + 1] === -1 || bets[i + 1] === 1)) {
      continue;
    }

    if (bets[i] === 1 && (bets[i + 1] === -1 || bets[i + 1] === 1)) {
      continue;
    }

    if (bets[i] === 2 && (bets[i + 1] === 1 || bets[i + 1] === -1)) {
      continue;
    }

    if (bets[i] === 6 && (bets[i + 1] === 1 || bets[i + 1] === -1)) {
      continue;
    }
    console.log('11111111',i, bets[i], bets[i+1]);
    return false;
  }
  return true;
}

function printResult () {
  // console.log(win, lose, lresult);
  // console.log(info);
  // if (!isRightBets(bets)) {
  //   console.log('wrong bets!!!!!!!!');
  // }
  // printPrices(pricesA);

    // console.log(R);
}
function printPrices(prices) {
  const result = Object.keys(info)
    .map(v => parseInt(v))
    .reduce((res, val) => {
      console.log(val, info[val], prices[val], info[val] * prices[val]);
      if (!prices[val]) return res;
      return res + info[val] * prices[val];
    }, 0);

  const result2 = Object.keys(info)
    .map(v => parseInt(v))
    .reduce((res, val) => {
      return res + info[val] * val;
    }, 0);
    console.log(result, result2);
} 