let reject = require('lodash.reject');


function analize2 (arr) {
  let countMore = 0;
  let countLess = 0;

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

function analize (arr, incomeValue = 70) {
  if (incomeValue < 70) {
    return null;
  }

  arr = reject(arr, function (v, i) {
      return i > 0 && arr[i - 1] === v;
  });
  let count = 3;
  let part = Math.floor(arr.length / count);
  let cofs = [];
  var i = 0;
  for (i = 0; i < count - 1; i++) {
    cofs.push(analize2(arr.slice(i*part, (i+1)* part)));
  }
  cofs.push(analize2(arr.slice(i*part, arr.length)));

  let averageCof = cofs.reduce((res,el) => res + el.unstableCoefficient, 0) / count;
  // let isUnstable = cofs.filter(el => el.unstableCoefficient < 0.3).length === cofs.length;
  let isUnstable = averageCof > 0.3;//cofs.filter(el => el.unstableCoefficient < 0.3).length === cofs.length;

  let up = cofs.filter(e => e.type === 'up').length === cofs.length;
  let down = cofs.filter(e => e.type === 'down').length === cofs.length;

  if (isUnstable) return null;
  if (!up && !down) return null;

  return up
    ? 'up'
    : 'down';
}

let arr = require('./1.js');

function MAP (e) {
  return e.v;
}

var fivemin = 5*60*1000;
function my (arr) {
  var start = arr[0].d;
  var indexFiveInd = arr.findIndex((e) => e.d - start >= fivemin);
  // console.log(indexFiveInd);
  for (var i = 0; i < arr.length - indexFiveInd; i++) {
    let betType = analize(arr.slice(i,i+indexFiveInd).map(MAP));
    if (!betType) continue;

    // arr.slice(i,i+indexFiveInd).forEach(e => console.log(e.v));

    i += indexFiveInd + 1;
    let arr2 = arr.slice(i,i+indexFiveInd);
    let time = arr2[0].d;
    let set = arr2[0].v;
    let close = arr2[arr2.length - 1].v;

    if (betType === 'up') {
      console.log(time, betType, set < close, set, close);
    } else {
      console.log(time, betType, set > close, set, close);
    }
    console.log('-------------');
  }
}
my(arr);
