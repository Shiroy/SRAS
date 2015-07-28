sras.controller('fatal', ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams){
    $scope.msg = $stateParams.msg;

    $scope.buttonClicked = function() {
        $state.go('boot');
    }
}]);
