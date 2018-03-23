function processFile(inputFile, onLine, onClose) {
    var fs = require('fs'),
        readline = require('readline'),
        instream = fs.createReadStream(inputFile),
        outstream = new (require('stream'))(),
        rl = readline.createInterface(instream, outstream);

    rl.on('line', onLine);

    rl.on('close', onClose);
}
processFile('log3.txt', analize, printResult);

let win = 0;
let lose = 0;

let lresult = 0;
let l = 0;
let moreThenTreeFail = 0;
let info = {};

function analize (line) {
  if (line.indexOf('Прогноз не оправдался') !== -1) {
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

    l && (info[l] = info[l] ? info[l] + 1 : 1);
    l = 0;
  }

}

var prices = {
  0: 1.8,
  1: 2 * 1.8 - 1,
  2: 6 * 1.8 - 3,
  3: 1.8 - 9,
  4: 2 * 1.8 - 10,
  5: 6 * 1.8 - 12,
  6: 1.8 - 18,
  7: 2 * 1.8 - 19,
  8: 6 * 1.8 -21,
  9: 1.8 - 27,
  10: 2 * 1.8 - 28,
}


function printResult () {
  console.log(win, lose, lresult, moreThenTreeFail, info);

  const result = Object.keys(info)
    .map(v => parseInt(v))
    .reduce((res, val) => {
      console.log(info[val], prices[val]);
      if (!prices[val]) return res;
      return res + info[val] * prices[val];
    }, 0);
    console.log(result);
}
