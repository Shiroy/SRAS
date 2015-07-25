sras.controller('player', function($scope){
    $scope.hideInventory = true;
    $scope.hideHistory = true;
    $scope.hideSkills = true;

    $scope.playerInfo;

    var requestPlayer = {
        msg: 'playerRequest',
        guid: 897
    };

    sendMessage(requestPlayer, 'playerInfo', function(msg){
        if(msg.data == 0)
            return;

        $scope.playerInfo = msg;
        setTimeout(function() { $WowheadPower.refreshLinks(); }, 1000)
    });
});
