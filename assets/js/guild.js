sras.controller('guild', ['$scope', '$stateParams', function($scope, $stateParams){

    if($stateParams.id === undefined || $stateParams.id <= 0)
        return;

    var guildMessage = {
        msg: 'guildInfo',
        guildId: $stateParams.id
    };

    $scope.guild = null;
    guildRanks = {};

    sendMessage(guildMessage, 'guildInfo', function(msg){
        if(!msg.hasData)
            return;

        $scope.guild = msg;

        $scope.guild.createdDate = new Date($scope.guild.createdDate * 1000);

        $scope.guild.ranks.forEach(function(r){
            r.hide = true;
            guildRanks[r.id] = r.name;
        });

        $scope.guild.members.forEach(function(m){
            m.hide = true;
            m.rank = guildRanks[m.rankId];
        });

        $scope.$apply();
    });

    $scope.and = function(val, mask){
        return (val & mask) != 0;
    }

}]);
