sras.controller('getApiKey', function($state, $scope){
  $scope.apiKey = '';

  $scope.ok = function(){
    config.apiKey = $scope.apiKey;

    //TODO: Sauvegarger les config

    $state.go('connect');
  }
})
