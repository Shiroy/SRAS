var http = require("http");
var fs = require('fs');
//var app = require("app");

var options = {
    hostname: referenceServer,
    path: '/app.asar',
    method: 'GET'
};

sras.controller('updater', ['$scope', '$http', '$state', function($scope, $http, $state){
    $scope.msg = "Recherche de mise à jour...";

    $scope.total = 1;
    $scope.progress = 0;

    $http.get('http://' + referenceServer + '/app.time').
    then(function(response) {
        if(config.lastUpdate === undefined || config.lastUpdate < response.data)
            downloadUpdate();
        else {
            $state.go('getApiKey');
        }

    }, function(response) {

    });

    function downloadUpdate() {

        var fd = fs.openSync(__dirname + "/../app.new", "w");

        $scope.msg = "Téléchargement...";

        var request = http.request(options, function(res){
            $scope.total = res.headers['content-length'];
            //console.log(res.headers);
            $scope.progress = 0;

            res.on('data', function(chunk){
                $scope.progress += chunk.length;
                var buf = new Buffer(chunk.length + 1);

                for(var i = 0 ; i < chunk.length ; i++){
                    buf.writeUInt8(chunk[i], i);
                }

                var written = 0;
                while(written < chunk.length)
                    written += fs.writeSync(fd, buf, written, chunk.length - written);

                $scope.$apply();
            });

            res.on('end', function(){
                fs.closeSync(fd);

                fs.rename(__dirname + '/../app.new', __dirname + '/../app.asar', function(err){
                    if(err)
                        throw err;

                    config.lastUpdate = Math.floor(Date.now() / 1000);
                    saveConfig();
                    $scope.msg = "Le SRAS a été mis à jour, veuillez le redémarrer"
                    $scope.$apply();
                });
            });

            $scope.$apply()
        });

        request.end();
    }
}]);
