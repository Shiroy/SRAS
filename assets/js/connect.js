sras.controller('connect', ['$scope', '$state', function($scope, $state){
  $scope.msg = 'Connecting...';

  if(webSocket != null){
    webSocket.close();
  }

  webSocket = new WebSocket('ws://' + referenceServer + '/');

  webSocket.onerror = function(error) {
    $state.go('fatal', {msg: 'Impossible de se connecter'});
  }

  webSocket.onclose = function() {
    $state.go('fatal', {msg: 'La connexion avec le serveur de jeu a été interrompue'});
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
        $state.go('fatal', {msg: 'Votre clé n\'est pas reconnue : ' + msg.error});
      }
    });
  }

  webSocket.onmessage = function(evt){
    dispatchMessage(JSON.parse(evt.data));
  }
}])
