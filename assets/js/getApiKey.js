sras.controller('getApiKey', function($state, $scope){
  $scope.apiKey = config.apiKey === undefined ? '' : config.apiKey;

  $scope.ok = function(){
    config.apiKey = $scope.apiKey;

    //TODO: Sauvegarger les config
    saveConfig();

    $state.go('connect');
  }
})
