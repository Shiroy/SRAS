sras.controller('getApiKey', function($state, $scope){
  $scope.apiKey = '';

  $scope.ok = function(){
    config.apiKey = $scope.apiKey;

    $state.go('connect');
  }
})
