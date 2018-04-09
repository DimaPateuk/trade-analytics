function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}
function getElementOffset (element) {
	return getOffset(element);
}


let {ipcRenderer} = require('electron');
let iframe = document.querySelector('.iframe');

function getFromFrame (selector) {
  return iframe.contentDocument.querySelector(selector);
}
function getData() {
	let data = getFromFrame('.rectCover.rectCover__chart')
		.nearestViewportElement
		.children[0]
		.children[5]
		.children[1]
		.__data__
		.map(v => ({ v: v.close, d: v.Date }));

	ipcRenderer.send('scrollLeft', { data });
}

ipcRenderer.on('scrollLeftDone', getData);

function start () {
	setTimeout(getData, 10000);
}

