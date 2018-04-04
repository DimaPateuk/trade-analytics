const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')

var fs = require('fs');
var priceLogName = `price-log-${(new Date()).toString().split(':').join('-')}`;
function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})
  console.log(win);
  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  ipcMain.on('asynchronous-reply', (event, arg) => {
    console.log(arg);
    fs.appendFile('log.txt', arg + '\r\n');
  })
  ipcMain.on('price-log', (event, {
    name,
    prices
  }) => {
      fs.appendFile(`prices/${name}`, '\r\n' + prices.join('\r\n'));
  })

  ipcMain.on('set-price-log', (event, arg) => {
    fs.appendFile('set-price', arg + '\r\n');
  })

  ipcMain.on('clear-log', (event, arg) => {
      fs.appendFile('log.txt', '1');
      fs.unlinkSync('log.txt');

  })

}

app.on('ready', createWindow)
