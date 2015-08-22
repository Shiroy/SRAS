sras.controller('getApiKey', ['$state', '$scope', '$http', function($state, $scope, $http){
  $scope.apiKey = config.apiKey === undefined ? '' : config.apiKey;

  $scope.serverList = new Array();
  $scope.selectedRealm = null;

  $http.get('http://62.210.100.11/sras_server.json').then(function(response){
     $scope.serverList = response.data;
     console.log(response.data);
     $scope.selectedRealm = $scope.serverList[0];
  });

  $scope.ok = function(){
    config.apiKey = $scope.apiKey;
    referenceServer = $scope.selectedRealm.ip + ':' + $scope.selectedRealm.port;

    //TODO: Sauvegarger les config
    saveConfig();

    $state.go('connect');
  }
}]);
