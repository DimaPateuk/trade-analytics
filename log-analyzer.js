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

let win = 0;
let lose = 0;

let lresult = 0;
let l = 0;
let moreThenTreeFail = 0;
let info = {};

function analize (line) {
  if (line.indexOf('Прогноз не оправдался') !== -1) {
    console.log(-1);
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
    console.log(1);
    win++;

    l && (info[l] = info[l] ? info[l] + 1 : 1);
    l = 0;
  }

}

var prices = {
  0: 1.8,
  1: 2 * 1.8,
  2: 6 * 1.8,
  3: -9,
  4: -10 + 2 *1.8,
  5: -12 + 6 *1.8,
  6: -18,
}


function printResult () {
  console.log(win, lose, lresult, moreThenTreeFail, info);

  const result = Object.keys(info)
    .map(v => parseInt(v))
    .reduce((res, val) => {
      if (!prices[val]) return res;
      return res + info[val] * prices[val];
    }, 0);
    console.log(result);
}
