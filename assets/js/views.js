function loadView(name){
  var fs = require('fs');
  var jade = require('jade');
  var filename = __dirname + '/assets/views/' + name + '.jade'
  var tmplt = jade.compileFile(filename, {filename: filename});

  return tmplt(); //Pas d'option de rendue pour le moment
}
