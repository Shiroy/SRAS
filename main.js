var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow = null;

app.on('window-all-closed', function() {
  if(process.platform != 'darwin'){
    app.quit();
  }
});

app.on('ready', function(){
  //Create the main window
  mainWindow = new BrowserWindow({width: 800, heigth: 600, title: 'SRAS - Système de recher et d\'aide à la surveillance'});
  mainWindow.maximize();
  mainWindow.openDevTools();
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null; //Garbage collection
  })
})
