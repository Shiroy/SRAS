var mapOpt = {
    base : "assets/maps/azeroth",
    startX: 17,
    startY: 20,
    nbX: 45-17,
    nbY: 61-20,
    repere : [
        {
            img : {i: 31, j: 49},
            locale: {x: 235, y: 187},
            globale: {x: -9458.9306, y: 44.6871} //Coordonnée de .gps (Attention : les axes sont inversé par rapport à l'mage xWoW <=> yImage et yWow <=> xImage)
        },
        {
            img: {i: 33, j: 38},
            locale: {x: 44, y: 233},
            globale: {x: -3689.0549, y: -620.7180}
        }
    ]
}

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

sras.controller('map', function($scope, $interval, $modal){
    var canvas = document.getElementById('view');
    var ctx = canvas.getContext('2d');
    var tiles;
    var positionVue = {
        x: 4000,
        y: 5000
    }

    var dragging = false;
    var lastMousePos;

    //var vecteurConv = generateConvVector(mapOpt);

    var pins = new Array();
    var pinImg = null;

    var scale = 1.0;

    var alpha=0, beta=0, tx=0, ty=0;

    var displayedPlayers = [];

    function initMap() {
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
            var dx = e.clientX - lastMousePos.x;
            var dy = e.clientY - lastMousePos.y;

            positionVue.x -= dx / scale;
            positionVue.y -= dy / scale;

            //console.log(positionVue);

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
                var src = mapOpt.base + '/map' + (i + mapOpt.startX) + '_' + (j+mapOpt.startY) + '.png';
                tiles[i][j].src = src;
                //console.log(src);
            }
        }

        initMap();

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
                //console.log(pix);
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

    $scope.wantedPlayers = [
        "Eryldor",
        "Testsras"
    ];

    $scope.wantedGuilds = [
        "Rez and Die"
    ];

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
    })

    load();
})
