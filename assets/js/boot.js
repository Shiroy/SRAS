sras.controller('Boot', function($state){
  var fs = require('fs');
  var ini = require('ini');

  //config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));

  //Do all init stuff here

  $state.go('dashboard');

})
