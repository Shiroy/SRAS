sras.controller('dashboard', function($scope){
    $scope.world = [];
    $scope.worldA2 = [];
    $scope.worldH2 = [];

    $scope.characters = [];

    $scope.usedChar = 0;

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
            $scope.usedChar = msg.characters[0].guid.toString();

        $scope.$apply();
    })
})