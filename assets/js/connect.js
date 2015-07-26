sras.controller('connect', ['$scope', '$state', function($scope, $state){
  $scope.msg = 'Connecting...';

  if(webSocket != null){
    webSocket.close();
  }

  webSocket = new WebSocket('ws://62.210.100.11:21194/');

  webSocket.onerror = function(error) {
    $scope.msg = error;
    $scope.$apply();
  }

  webSocket.onopen = function(){
    apiKeyMsg = {
      msg: 'apiKey',
      apiKey: config.apiKey
    };

    $scope.msg = "Authentication...";
    $scope.$apply(); //Force angular à mettre la page web à jour car il ne peut pas deviner que l'onmodifie le $scope dans cette fonction. TODO : Etudier plus en détail ce cas

    sendMessage(apiKeyMsg, 'apiKeyResp', function(msg){
      if(msg.error == 'ok'){
        accountId = msg.account;
        accountEmail = msg.email;
        $state.go('dashboard');
      }
      else {
        $scope.msg = "Authentication..." + msg.error;
      }

      $scope.$apply();
    });
  }

  webSocket.onmessage = function(evt){
    dispatchMessage(JSON.parse(evt.data));
  }
}])
