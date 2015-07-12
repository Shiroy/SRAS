sras.controller('dashboard', function($scope){
    $scope.world = [];
    $scope.worldA2 = [];
    $scope.worldH2 = [];

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
})
