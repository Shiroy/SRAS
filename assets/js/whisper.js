sras.controller('whisper', ['$scope', '$attrs', function($scope, $attrs){
    var receiver = $scope.$eval($attrs.receiver);
    if(receiver === undefined || receiver == "")
        return;

    $scope.receiver = receiver;
    $scope.messages = [];

    $scope.msg = '';

    $scope.whisper = function(msg){
        var whisperMsg = {
            msg: 'whisper',
            dest: receiver,
            content: msg
        };

        sendMessage(whisperMsg);

        $scope.messages.push({
            pseudo: "Vous", //J'ai trop la flemme de récupérer le vrai
            content: msg
        });

        $scope.msg = '';
    }

    registerListener('whisper', function(msg){

        if(msg.sender != receiver)
            return;

        $scope.messages.push({
            pseudo: msg.sender,
            content: msg.content
        });

        $scope.$apply();
    });
}]);
