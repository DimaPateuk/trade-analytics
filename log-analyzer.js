function processFile(inputFile, onLine, onClose) {
    var fs = require('fs'),
        readline = require('readline'),
        instream = fs.createReadStream(inputFile),
        outstream = new (require('stream'))(),
        rl = readline.createInterface(instream, outstream);

    rl.on('line', onLine);

    rl.on('close', onClose);
}
processFile('log.txt', analize, printResult);

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

let R = 0;
function analize (line) {
  const brtMy = parseInt(line.split("|")[line.split("|").length - 2]);
  if (line.indexOf('Прогноз не оправдался') !== -1) {
    // console.log(-brtMy);
    myBETS.push(-brtMy);
    // console.log('-1');
    R += parseInt(line.split('|')[6]) * -1;
    console.log(line.split("|")[2]);
    lose++;
    l++;
    infoWin[w] = infoWin[w] ? infoWin[w] + 1 : 1;
    w = 0;
    if (l%3 === 0) {
      moreThenTreeFail++;
    }
    if (lresult < l) {
      lresult = l;
    }
  }

  if (line.indexOf('Прогноз оправдался') !== -1) {
    // console.log(brtMy * rate);
    // console.log('1');
    console.log(line.split("|")[2]);
    win++;
    w++;
      R += parseInt(line.split('|')[6]) * rate;
    info[l] = info[l] ? info[l] + 1 : 1;
    myBETS.push(brtMy * rate);
    l = 0;
    // console.log(R);
  }

}
const minBet = 5;

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

// var pricesA = {
//   0: minBet * rate,
//   1: 2*minBet * rate - minBet,
//   2: 6*minBet * rate - 3*minBet,
//   3: 18*minBet * rate - 9*minBet,
//   4: 54*minBet * rate - 27*minBet,
//   5: 1*minBet * rate - 81*minBet,
//   6: 1*minBet * rate - 82*minBet,
//   7: 1*minBet * rate - 83*minBet,
//   8: 1*minBet * rate - 84*minBet,
//   9: 1*minBet * rate - 85*minBet,
//   10: 1*minBet * rate - 86*minBet,
// };

var pricesA = {
  0: minBet * rate,
  1: 2*minBet * rate - minBet,
  2: 6*minBet * rate - 3*minBet,
  3: 18*minBet * rate - 9*minBet,
  4: 54*minBet * rate - 27*minBet,
  5: 162*minBet * rate - 81*minBet,
  6: 1*minBet * rate - 243*minBet,
  7: 1*minBet * rate - 244*minBet,
  8: 1*minBet * rate - 245*minBet,
  9: 1*minBet * rate - 246*minBet,
  10: 1*minBet * rate - 247*minBet,
};



// console.log(pricesA);

function printResult () {
  // console.log(win, lose, lresult);
  // console.log(info);
  // console.log(infoWin);
  // for (var i = 0; i < 11; i++) {
  //   info[i] = info[i] ? info[i] : 1;
  // }
  // info[5] = 1;

  // for (var i = 0; i < 6; i++) {
  //   if (info[i])
  //   info[i] = info[i] * 100;
  // }
  // console.log(info);
  // }
  // printPrices(pricesA);

    // console.log(R);
    const t = myBETS.reverse();
    for (var i = 0; i < t.length; i++) {
      // console.log(t[i]);
    }

}
function printPrices(prices) {
  let result = Object.keys(info)
    .map(v => {
      return parseInt(v)
    })
    .reduce((res, val) => {
      // console.log(val, info[val], prices[val], info[val] * prices[val]);
      if (!prices[val]) return res;
      return res + info[val] * prices[val];
    }, 0);

  let resultWin = Object.keys(infoWin)
    .map(v => {
      return parseInt(v)
    })
    .reduce((res, val) => {
      // console.log(val, infoWin[val], prices[val], infoWin[val] * prices[val]);
      if (!prices[val]) return res;
      return res - infoWin[val] * prices[val];
    }, 0);


    console.log(result, resultWin);
}
