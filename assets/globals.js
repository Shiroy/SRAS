var fs = require('fs');

var config  = {};

var webSocket = null; //la web socket de communication
var accountId = null;
var accountEmail = null;

function saveConfig(){
    var configContent = JSON.stringify(config);
    fs.writeFile('config.json', configContent, function(err){
        if(err)
            throw err;
    });
}

function loadConfig(){
    var data = fs.readFileSync('config.json', {encoding: 'utf8'});
    config = JSON.parse(data);
}
