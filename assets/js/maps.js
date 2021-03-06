// function generateConvVector(opt){
//     var coordLocal = [
//         {
//             x: (opt.repere[0].img.i - opt.startX) * 256 + opt.repere[0].locale.x,
//             y: (opt.repere[0].img.j - opt.startY) * 256 + opt.repere[0].locale.y,
//         },
//         {
//             x: (opt.repere[1].img.i - opt.startX) * 256 + opt.repere[1].locale.x,
//             y: (opt.repere[1].img.j - opt.startY) * 256 + opt.repere[1].locale.y,
//         }
//     ];
//
//     var vecteurConversion = {
//         x : (coordLocal[1].y - coordLocal[0].y) / (opt.repere[1].globale.x - opt.repere[0].globale.x), //CF Inversement des coordonnée wow par rapport aux coord image
//         y : (coordLocal[1].x - coordLocal[0].x) / (opt.repere[1].globale.y - opt.repere[0].globale.y),
//     }
//
//     return vecteurConversion;
// }

var fs = require('fs');
var async = require('async');

sras.controller('map', ['$scope', '$interval', '$modal', function($scope, $interval, $modal){
    var canvas = document.getElementById('view');
    var ctx = canvas.getContext('2d');
    var tiles;
    var positionVue = {
        x: 600,
        y: 7000
    }

    var dragging = false;
    var lastMousePos;

    //var vecteurConv = generateConvVector(mapOpt);

    var pins = new Array();
    var pinImg = null;

    var scale = 1.0;

    var alpha=0, beta=0, tx=0, ty=0;

    var displayedPlayers = [];
    $scope.cartes = [];
    $scope.mapLoaded = false;
    var aPlayerIsFollowed = false;
    var followedPlayer = '';

    function loadMaps(){
        fs.readdir(__dirname + '/assets/maps', function(err, files){
            if(err){
                console.log(err);
                return;
            }

            async.map(files, function(f, callback){
                fs.stat(__dirname + '/assets/maps/' + f, function(err, stat){

                    if(err)
                        callback(err, null);

                    if(stat.isDirectory()){
                        fs.exists(__dirname + '/assets/maps/' + f + '/map.json', function(ok){
                            if(!ok)
                                callback(null, 'ok');
                            fs.readFile(__dirname + '/assets/maps/' + f + '/map.json', function(err, data){
                                if(err)
                                    callback(err);
                                var obj = JSON.parse(data);
                                obj.path = 'assets/maps/' + f;
                                initMapInfo(obj, callback);
                            })
                        })
                    }
                    else{
                        callback(null, 'ok');
                    }
                })
            }, function(err, res){
                if(err)
                    throw err;
                $scope.mapLoaded = "true";
                $scope.selectedMap = $scope.cartes[1];
                $scope.$apply();
                $scope.selectMap($scope.selectedMap);
            })

        })
    }

    function initMapInfo(map, callback){
        var minX=null, maxX=null, minY=null, maxY=null;
        var map_parser = /map(\d+)_(\d+).png/;
        fs.readdir(__dirname + '/' + map.path, function(err, files){

            files.forEach(function(f){
                if((chunk = map_parser.exec(f)) !== null){
                    if(minX == null || minX > chunk[1]){
                        minX = Number(chunk[1]);
                    }
                    if(maxX == null || maxX < chunk[1]){
                        maxX = Number(chunk[1]);
                    }
                    if(minY == null || minY > chunk[2]){
                        minY = Number(chunk[2]);
                    }
                    if(maxY == null || maxY < chunk[2]){
                        maxY = Number(chunk[2]);
                    }
                }
            });

            map.startX = minX;
            map.nbX = maxX - minX;
            map.startY = minY;
            map.nbY = maxY - minY;

            $scope.cartes.push(map);
            callback(null, 'ok');
        })

    }

    loadMaps();

    $scope.selectMap = function(map) {
        mapOpt = map;

        load();
    }

    function initMap() {

        if(mapOpt.repere === undefined)
            return;

        var coordLocal = [
            {
                x: (mapOpt.repere[0].img.i - mapOpt.startX) * 256 + mapOpt.repere[0].locale.x,
                y: (mapOpt.repere[0].img.j - mapOpt.startY) * 256 + mapOpt.repere[0].locale.y,
            },
            {
                x: (mapOpt.repere[1].img.i - mapOpt.startX) * 256 + mapOpt.repere[1].locale.x,
                y: (mapOpt.repere[1].img.j - mapOpt.startY) * 256 + mapOpt.repere[1].locale.y,
            }
        ];

        alpha = (coordLocal[1].x - coordLocal[0].x) / (mapOpt.repere[1].globale.y - mapOpt.repere[0].globale.y);
        tx = (coordLocal[0].x - alpha * mapOpt.repere[0].globale.y) / alpha;

        beta = (coordLocal[1].y - coordLocal[0].y) / (mapOpt.repere[1].globale.x - mapOpt.repere[0].globale.x);
        ty = (coordLocal[0].y - beta * mapOpt.repere[0].globale.x) / beta;

        positionVue.x = coordLocal[0].x - ctx.canvas.width/2;
        positionVue.y = coordLocal[0].y - ctx.canvas.height/2;
    }

    canvas.onmousedown = function(e) {
        dragging = true;

        lastMousePos = {
            x: e.clientX,
            y: e.clientY
        }
    }

    canvas.onmousemove = function(e) {
        if(dragging)
        {
            aPlayerIsFollowed = false;
            var dx = e.clientX - lastMousePos.x;
            var dy = e.clientY - lastMousePos.y;

            positionVue.x -= dx / scale;
            positionVue.y -= dy / scale;

            console.log(positionVue);

            lastMousePos = {
                x: e.clientX,
                y: e.clientY
            }
        }
    }

    canvas.onmouseup = function(e) {
        dragging = false;
    }

    canvas.onwheel = function(e) {
        //console.log(e.deltaY);
        scale -= e.deltaY / 1000;

        if(scale > 1.3)
            scale = 1.3;
        if(scale < 0.3)
            scale = 0.3;

        e.preventDefault();
    }

    function resizeCanvas() {
        var parent = document.getElementById('canvas-container');
        ctx.canvas.width = parent.clientWidth;
        ctx.canvas.height = parent.clientHeight;

        console.log("Resizing canvas");

        draw();
    }

    window.onresize = resizeCanvas;

    function load(){

        pinImg = new Image();
        pinImg.isOk = false;
        pinImg.onload=function(){
            this.isOk = true;
        }
        pinImg.src = 'assets/maps/pin-yellow.png'

        tiles = new Array(mapOpt.nbX+1);

        for (var i = 0; i <= mapOpt.nbX; i++) {
            tiles[i] = new Array(mapOpt.nbY+1);
        }

        for (var i = 0; i < mapOpt.nbX; i++) {
            for(var j = 0 ; j < mapOpt.nbY; j++){
                tiles[i][j] = new Image();
                tiles[i][j].isOk = false;
                tiles[i][j].onload = function(){
                    this.isOk = true;
                }
                tiles[i][j].onerror = function() {};
                var src = mapOpt.path + '/map' + (i + mapOpt.startX) + '_' + (j+mapOpt.startY) + '.png';
                tiles[i][j].src = src;
                //console.log(src);
            }
        }

        initMap();
        //positionVue = wowCoordToPixel(0, 0);

        resizeCanvas();
    }

    function draw() {
        ctx.setTransform(1, 0, 0, 1, 0, 0); //Reset the transformation
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.scale(scale, scale);
        ctx.translate(-positionVue.x, -positionVue.y);

        for (var i = 0; i < mapOpt.nbX; i++) {
            for(var j = 0 ; j < mapOpt.nbY; j++){
                if(tiles[i][j].isOk)
                    ctx.drawImage(tiles[i][j], i*256, j*256);
            }
        }

        if(pinImg.isOk) {
            pins.forEach(function(pin){
                var pix = wowCoordToPixel(pin);
                pix.x -= pinImg.width/2;
                pix.y -= pinImg.height/2;

                if(aPlayerIsFollowed){
                    if(followedPlayer == pin.name){
                        positionVue.x = pix.x - ctx.canvas.width/2;
                        positionVue.y = pix.y - ctx.canvas.height/2;
                        if(mapOpt.map != pin.Map){
                            $scope.cartes.forEach(function(carte){
                                if(carte.map == pin.Map)
                                    $scope.selectedMap = carte;
                                    $scope.selectMap($scope.selectedMap);
                            });
                            $scope.$apply();
                        }
                    }
                }
                else {
                    if(mapOpt.map != pin.Map)
                        return;
                }

                ctx.drawImage(pinImg, pix.x, pix.y);
            });
        }

        window.requestAnimationFrame(draw);
    }

    function wowCoordToPixel(wowCoord) {
        var pixel = {
            x: alpha * (wowCoord.Y + tx),
            y: beta * (wowCoord.X + ty),
        }

        return pixel;
    }

    $scope.wantedPlayers = new Array();

    $scope.wantedGuilds = new Array();

    $scope.removeItem = function(arr, item){
        arr.splice(arr.indexOf(item), 1);
    }

    $scope.ajouterJoueur = function(){
        var textDialog = openGetTextDialog($modal, 'Ajouter un joueur', 'Entrer le pseudo du joueur à ajouter : ');
        textDialog.result.then(function(pName){
            $scope.wantedPlayers.push(pName);
        })
    }

    $scope.ajouterGuilde = function(){
        var textDialog = openGetTextDialog($modal, 'Ajouter une guilde', 'Entrer le nom de la guilde à ajouter : ');
        textDialog.result.then(function(gName){
            $scope.wantedGuilds.push(gName);
        })
    }

    var updateTimer = $interval(function(){

        if($scope.wantedPlayers.length == 0 && $scope.wantedGuilds.length == 0)
            return;

        var msg = {
            msg: "getPlayersPosition",
            players: $scope.wantedPlayers,
            guilds: $scope.wantedGuilds,
        }

        sendMessage(msg, 'playersPosition', function(msg){
            pins = msg.players;
        });
    }, 1000);

    $scope.$on('$destroy', function(){
        $interval.cancel(updateTimer);
    });

    $scope.followPlayer = function(playerToFollow) {
        followedPlayer = playerToFollow;
        aPlayerIsFollowed = true;
    }

    //load();
}])
