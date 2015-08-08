sras.controller("playerLogWatcher", ['$scope', '$attrs', function($scope, $attrs){
    var playerName = $scope.$eval($attrs.pseudo);
    if(playerName === undefined || playerName == "")
        return;

    var guid = Number($scope.$eval($attrs.guid));
    if(guid == null)
        return;

    $scope.totalItem = 1;
    $scope.logs = [];
    $scope.page = 1;
    $scope.playerName = playerName

    $scope.loadPage = function()
    {
        $scope.logs = [];

        var logMsg = {
            msg: 'logExtract',
            guid: guid,
            page: $scope.page
        };

        sendMessage(logMsg, 'logExtract', function(msg){
            $scope.totaltime = msg.totalLogEntry;

            msg.logs.forEach(function(l){
                l.data = JSON.parse(l.data);
            })

            $scope.logs = msg.logs;
            $scope.$apply();
            $WowheadPower.refreshLinks();
        });
    }

    $scope.loadPage();
}]);
