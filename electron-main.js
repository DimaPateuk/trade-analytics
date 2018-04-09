const { scrollLeft } = require('./robotControllet');
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')

var fs = require('fs');
var priceLogName = `price-log-${(new Date()).toString().split(':').join('-')}`;
function createWindow () {

  win = new BrowserWindow({width: 800, height: 600})

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  ipcMain.on('asynchronous-reply', (event, arg) => {
    fs.appendFile('log.txt', arg + '\r\n');
  });

  ipcMain.on('set-price-log', (event, arg) => {
    fs.appendFile('set-price', arg + '\r\n');
  });

  ipcMain.on('fillPrice', (event, arg) => {
    fillInput(arg.x, arg.y, arg.text);
    ipcMain.on('fillPriceDone');
  });

  ipcMain.on('startScroll', (event, arg) => {
    setInterval(scrollLeft, 10000);
  });

  var prependFile = require('prepend-file');
   
  prependFile('message.txt', 'data to prepend', function (err) {
      if (err) {
          // Error 
      }
   
      // Success 
      console.log('The "data to prepend" was prepended to file!');
  });
  var last;
  ipcMain.on('scrollLeft', (event, arg) => {
    scrollLeft();
    var result;
    if (!last) {
      result = arg
        .data
        .map(e => `${e.v} ${e.d}`)
        .join('\r\n');

    } else {
      result = arg
        .data
        .slice(0, arg.data.findIndex((e) => e.d === last.d))
        .map(e => `${e.v} ${e.d}`)
        .join('\r\n');
    }

    last = arg.data[0];
    prependFile('message.txt', result + '\r\n', function (err) {
          if (err) {
              console.log(err);
              return;
          }

          setTimeout(() => {
            win.webContents.send('scrollLeftDone');
          }, 3000);
      });
  });
}

app.on('ready', createWindow)



