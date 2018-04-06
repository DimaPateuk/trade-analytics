// const { scrollLeft } = require('./robotControllet');
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

  ipcMain.on('scrollLeft', (event, arg) => {
    console.log(arg.data);
    // scrollLeft();
    // ipcMain.on('scrollLeftDone');
  });
}

app.on('ready', createWindow)



