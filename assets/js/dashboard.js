sras.controller('dashboard', function($scope){
    $scope.world = [];
    $scope.worldA2 = [];
    $scope.worldH2 = [];

    $scope.characters = [];
    $scope.worldA2Msg = '';
    $scope.worldH2Msg = '';

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
            $scope.usedChar = msg.characters[0].guid.toString();
            $scope.changeCharacter();
        }

        $scope.$apply();
    })

    $scope.changeCharacter = function(){
        var characterChangeMsg = {
            msg: 'selectedCharacterChange',
            guid: Number($scope.usedChar)
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
})
