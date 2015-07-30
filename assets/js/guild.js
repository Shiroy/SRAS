sras.controller('guild', ['$scope', function($scope){

    var guildMessage = {
        msg: 'guildInfo',
        guildId: 2
    };

    $scope.guild = null;
    guildRanks = {};

    sendMessage(guildMessage, 'guildInfo', function(msg){
        if(!msg.hasData)
            return;

        $scope.guild = msg;

        $scope.guild.createdDate = new Date($scope.guild.createdDate);

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
