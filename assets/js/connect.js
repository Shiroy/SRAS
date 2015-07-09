sras.controller('connect', function($scope){
  $scope.msg = 'Connecting...';

  if(webSocket != null){
    webSocket.close();
  }

  webSocket = new WebSocket('ws://zfjafn.fr/');

  webSocket.onerror = function(error) {
    $scope.msg = error;
  }
})
