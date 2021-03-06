sras.controller('dashboard', ['$scope', '$interval', '$modal', function($scope, $interval, $modal){
    $scope.world = [];
    $scope.worldA2 = [];
    $scope.worldH2 = [];

    $scope.characters = [];
    $scope.worldA2Msg = '';
    $scope.worldH2Msg = '';
    $scope.twoWorld = true;

    $scope.conversations = [];

    $scope.usedChar = 0;

    $scope.searchMethods = [
        {
            type: 1,
            name: 'Personnage',
            placeholder: 'Entrer le nom du personnage'
        },
        {
            type: 2,
            name: 'Guilde',
            placeholder: 'Entrer le nom de la guilde'
        },
        {
            type: 3,
            name: 'Compte',
            placeholder: 'Entrer l\'adresse email'
        },
        {
            type: 4,
            name: 'Tous les personnage ayant un item',
            placeholder: 'Entrer l\'id de l\'item'
        },
        {
            type: 5,
            name: 'Tous les personnage ayant un haut-fait',
            placeholder: 'Entrer l\'id du haut-fait'
        }
    ];
    $scope.selectedSearchMethod = $scope.searchMethods[0];
    $scope.searchMotif = '';
    $scope.searchResults = [];

    registerListener('worldChat', function(msg){
        var newChat = {
            player: msg.playerName,
            message: msg.message,
            faction: msg.faction
        }

        $scope.world.push(newChat);
        if(msg.faction == 'alliance') {
            $scope.worldA2.push(newChat);
        }
        else {
            $scope.worldH2.push(newChat);
        }


        $scope.$apply();
    })

    var getCharactersMsg = {
        msg: 'getCharacters'
    }

    sendMessage(getCharactersMsg, 'characterList', function(msg){
        $scope.characters = msg.characters;
        if($scope.characters[0] !== undefined)
        {
            $scope.usedChar = msg.characters[0];
            $scope.changeCharacter();
        }

        $scope.$apply();
    })

    $scope.changeCharacter = function(){
        var characterChangeMsg = {
            msg: 'selectedCharacterChange',
            guid: $scope.usedChar.guid,
            name: $scope.usedChar.name
        }

        sendMessage(characterChangeMsg);
    }

    $scope.sendToWorld = function(isAlliance, msg){
        var worldChat = {
            msg: 'worldChat',
            isAlliance: isAlliance,
            content: msg
        }

        sendMessage(worldChat);

        $scope.worldA2Msg = '';
        $scope.worldH2Msg = '';
    }

    $scope.search = function(motif){
        var searchMsg = {
            msg: 'search',
            type: $scope.selectedSearchMethod.type,
            motif: motif
        };

        sendMessage(searchMsg, 'SearchResponse', function(resp){
            $scope.resultType = resp.resultType;
            $scope.searchResults = resp.result;

            $scope.$apply();
        })
    }

    $scope.uptime = 0;
    $scope.nbA2 = $scope.nbH2 = $scope.nbNeutral = 0;

    var getServerInfoMsg = {
        msg: 'getServerInfo'
    };

    sendMessage(getServerInfoMsg, 'serverInfo', function(msg){
        $scope.uptime = msg.uptime;
        $scope.nbA2 = msg.nbA2;
        $scope.nbH2 = msg.nbH2;
        $scope.nbNeutral = msg.nbNeutral;

        $scope.$apply();
    });

    registerListener("playerIncrease", function(msg){
        if(msg.team == 0)
            $scope.nbA2++;
        else if(msg.team == 1)
            $scope.nbH2++;
        else {
            $scope.nbNeutral++;
        }
    });

    registerListener("playerDecrease", function(msg){
        if(msg.team == 0)
            $scope.nbA2--;
        else if(msg.team == 1)
            $scope.nbH2--;
        else {
            $scope.nbNeutral--;
        }
    });

    var updateUptime = $interval(function(){
        $scope.uptime += 1;
    }, 1000);

    $scope.$on('$destroy', function(){
        $interval.cancel(updateUptime);
    });

    $scope.annonceServeur = function() {
        var dialogAnnonce = openGetTextDialog($modal, 'Annonce serveur', 'Entrez le texte de l\'annonce');
        dialogAnnonce.result.then(function(annonce){
            var msg = {
                msg: "serverAnnounce",
                text: annonce
            };

            sendMessage(msg);
        })
    }

    $scope.newConversation = function() {
        var textDialog = openGetTextDialog($modal, 'Nouvelle conversation', 'Entrer le nom du destinataire : ');
        textDialog.result.then(function(receiver){
            $scope.conversations.push(receiver);
        })
    }

    $scope.closeConversation = function(c) {
        $scope.conversations.splice($scope.conversations.indexOf(c), 1);
    }
}])
