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
            name: 'Personnage'
        },
        {
            type: 2,
            name: 'Guilde'
        },
        {
            type: 3,
            name: 'Compte'
        },
        {
            type: 4,
            name: 'Tous les personnage ayant un item'
        },
        {
            type: 5,
            name: 'Tous les personnage ayant un haut fait'
        }
    ];
    $scope.selectedSearchMethod = 1;

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
})
