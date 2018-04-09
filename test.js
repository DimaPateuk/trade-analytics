let reject = require('lodash.reject');
function analize2 (arr) {
  let countMore = 0;
  let countLess = 0;

  arr = reject(arr, function (v, i) {
      return i > 0 && arr[i - 1] === v;
  });

  for (var i = 0; i < arr.length; i++) {
  	for (var j = i; j < arr.length; j++) {
  		if (arr[i] < arr[j]) countMore++;
      if (arr[i] > arr[j]) countLess++;
  	}
  }

  let unstableCoefficient = (Math.min(countMore, countLess) || 1) / Math.max(countMore, countLess);

  let tMore = 0;
  let tLess = 0;

  let twentyPersentPoints = Math.floor(arr.length * 0.2);
  for (var i = 0; i < twentyPersentPoints; i++) {
    for (var j = arr.length - twentyPersentPoints; j < arr.length; j++) {
      if (arr[i] > arr[j]) tMore++;
      if (arr[i] < arr[j]) tLess++;
    }
  }

  let type;
  if (tMore && tLess) type = null;
  else if (tMore) type = 'down';
  else if (tLess) type = 'up';

  return { unstableCoefficient, type };

}

function analize (arr, incomeValue = 70, l) {
  if (incomeValue < 70) {
    return null;
  }

  arr = reject(arr, function (v, i) {
      return i > 0 && arr[i - 1] === v;
  });
  let count = 3;//3;
  let part = Math.floor(arr.length / count);
  let cofs = [];
  var i = 0;
  for (i = 0; i < count - 1; i++) {
    cofs.push(analize2(arr.slice(i*part, (i+1)* part)));
  }
  cofs.push(analize2(arr.slice(i*part, arr.length)));

  let unstableCoefficient = cofs.reduce((res,el) => res + el.unstableCoefficient, 0) / count;
  // let isUnstable = cofs.filter(el => el.unstableCoefficient < 0.3).length === cofs.length;
  // let isUnstable = unstableCoefficient > 0.3;//cofs.filter(el => el.unstableCoefficient < 0.3).length === cofs.length;
  let isUnstable = cofs.every(el => el.unstableCoefficient < 0.3);

  let up = cofs.every(e => e.type === 'up');
  let down = cofs.every(e => e.type === 'down');

  if (isUnstable) return {unstableCoefficient};
  if (!up && !down) return {unstableCoefficient};

  let betType = up
    ? 'up'
    : 'down';

  return {
    unstableCoefficient,
    betType,
  }
}

function processFile(inputFile, onLine, onClose) {
    var fs = require('fs'),
        readline = require('readline'),
        instream = fs.createReadStream(inputFile),
        outstream = new (require('stream'))(),
        rl = readline.createInterface(instream, outstream);

    rl.on('line', onLine);

    rl.on('close', onClose);
}

let go = (
  analizeCount = 5,
  betCount = 5,
) => new Promise ((res) => {

processFile('message.txt', tic, onEnd);

let lineCount = 0;
let prevTime
let prices = [];
let pricesStore = [];

let priceStoreWin = [];
let priceStoreLose = [];


analizeCount = analizeCount * 60;
betCount = betCount * 60;
let betBeckCount = 0;
let myBet;

let w = 0;
let l = 0;

let tw = 0;
let tl = 0;
let info = {};
let dayInfo = {};

let stop = false;
function tic(line) {
  lineCount++;
  let [val, d] = line.split(' ').map(e => parseFloat(e, 10));
  let currentDate = new Date(d);
  if (!val || !d) {
    return;
  }
  let currentDateStr = `${currentDate.toISOString().split('T')[0]}-${currentDate.getHours()%2 === 0 ? currentDate.getHours() : currentDate.getHours() - 1}`;

  if (!dayInfo[currentDateStr])
    dayInfo[currentDateStr] = {
      w: 0,
      l: 0,
    }

  prices.push(val);

  if (prices.length !== analizeCount) return;

  prices = prices.slice(1);

  if (betBeckCount) {
    betBeckCount--;
    if (betBeckCount === 0) {
      let { betType, val, pricesStore } = myBet;
      let end = prices[prices.length - 1];

      if (val === end) return;
      let isWin;
      if (betType === 'up') {
        if (val < end) {
          isWin = true;
        } else {
          isWin = false;
        }
      }

      if (betType === 'down') {
        if (val > end) {
          isWin = true;
        } else {
          isWin = false;
        }
      }

      if (isWin) {
        w++;
        tw++;
        info[l] = info[l] ? info[l] + 1 : 1;
        l = 0;
        dayInfo[currentDateStr].w++;
      } else {
        l++;
        tl++;
        w = 0;
        dayInfo[currentDateStr].l++;
      }
      console.log('\033c');
      console.log(dayInfo);
      console.log(info);
      console.log('total win', tw);
      console.log('total lose', tl);
      console.log('total bets', tl + tw);
      console.log('win rate', tw / (tl+tw));
    }

    return;
  }

  if (currentDate.getHours() < 9 || currentDate.getHours() > 21) {
    return;
  }

  if (
    dayInfo[currentDateStr].w === 1 && l === 0
    || dayInfo[currentDateStr].l === 1
  ) {
    return;
  }


  let { betType } = analize(prices, 100, l);
  if (!betType) return;


  betBeckCount = betCount;
  myBet = {
    betType,
    val: prices[prices.length - 1],
  };
}


function onEnd () {
  console.log(info);
  console.log(analizeCount / 60, betCount / 60);
  console.log('total win', tw);
  console.log('total lose', tl);
  console.log('win rate', tw / (tl+tw));
  console.log('-------------------------');
  console.log();

  res();
}

});
go();
// (async () => {
//   await go(20,20);
//   await go(30,30);
//   await go(40,40);
//   await go(50,50);
//   await go(60,60);
// })();
