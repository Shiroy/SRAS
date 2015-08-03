sras.controller('account', ['$scope', '$stateParams', function($scope, $stateParams){

    $scope.account = null;

    if($stateParams.id === undefined || $stateParams.id <= 0)
        return;

    var accountInfoMsg = {
        msg: 'accountInfo',
        id: $stateParams.id
    };

    sendMessage(accountInfoMsg, 'accountInfo', function(msg){
        if(msg.hasData == false)
            return;

        $scope.account = msg;
        $scope.$apply();
    });

}]);
