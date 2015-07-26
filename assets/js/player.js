sras.controller('player', function($scope, $stateParams){
    $scope.hideInventory = true;
    $scope.hideHistory = true;
    $scope.hideSkills = true;
    $scope.cacherSacADos = true;
    $scope.sacADos = [];
    $scope.sac = [
        {
            hide: true
        },
        {
            hide: true
        },
        {
            hide: true
        },
        {
            hide: true
        }
    ];
    $scope.hideBank = true;
    $scope.bank = [];
    $scope.bankSac = [
        {
            hide: true
        },
        {
            hide: true
        },
        {
            hide: true
        },
        {
            hide: true
        },
        {
            hide: true
        },
        {
            hide: true
        },
        {
            hide: true
        },
    ];



    $scope.playerInfo;

    if($stateParams.guid === undefined || $stateParams.guid <= 0)
        return;

    var requestPlayer = {
        msg: 'playerRequest',
        guid: $stateParams.guid
    };



    sendMessage(requestPlayer, 'playerInfo', function(msg){

        //On a la garantie que les items arrivent par ordre croissant de bag puis de slot

        if(msg.data == 0)
            return;

        $scope.playerInfo = msg;

        msg.inventory.forEach(function(item){
            if(item.bag == 0)
            {
                switch (item.slot) {
                    case 0:
                        $scope.tete = item;
                        break;
                    case 1:
                        $scope.cou = item;
                        break;
                    case 2:
                        $scope.epaule = item;
                        break;
                    case 3:
                        $scope.chemise = item;
                        break;
                    case 4:
                        $scope.torse = item;
                        break;
                    case 5:
                        $scope.ceinture = item;
                        break;
                    case 6:
                        $scope.jambe = item;
                        break;
                    case 7:
                        $scope.pied = item;
                        break;
                    case 8:
                        $scope.poignet = item;
                        break;
                    case 9:
                        $scope.main = item;
                        break;
                    case 10:
                        $scope.anneau1 = item;
                        break;
                    case 11:
                        $scope.anneau2 = item;
                        break;
                    case 12:
                        $scope.bijou1 = item;
                        break;
                    case 13:
                        $scope.bijou2 = item;
                        break;
                    case 14:
                        $scope.dos = item;
                        break;
                    case 15:
                        $scope.arme1 = item;
                        break;
                    case 16:
                        $scope.arme2 = item;
                        break;
                    case 17:
                        $scope.armeadistance = item;
                        break;
                    case 18:
                        $scope.tabard = item;
                        break;
                    case 19:
                        $scope.sac[0].item = item;
                        $scope.sac[0].contenue = [];
                        break;
                    case 20:
                        $scope.sac[1].item = item;
                        $scope.sac[1].contenue = [];
                        break;
                    case 21:
                        $scope.sac[2].item = item;
                        $scope.sac[2].contenue = [];
                        break;
                    case 22:
                        $scope.sac[3].item = item;
                        $scope.sac[3].contenue = [];
                        break;
                    default:
                    {
                        if(item.slot >= 23 && item.slot < 39)
                            $scope.sacADos.push(item);
                        if(item.slot >= 39 && item.slot < 67)
                            $scope.bank.push(item);
                        if(item.slot >= 67 && item.slot < 86){
                            $scope.bankSac[item.slot - 67].item = item;
                            $scope.bankSac[item.slot - 67].contenue = [];
                        }
                        break;
                    }
                }
            }
            else{
                $scope.sac.forEach(function(s){
                    if(s.item === undefined)
                        return;

                    if(item.bag == s.item.itemGuid)
                        s.contenue.push(item);
                });

                $scope.bankSac.forEach(function(s){
                    if(s.item === undefined)
                        return;

                    if(item.bag == s.item.itemGuid)
                        s.contenue.push(item);
                })
            }
        })

        $scope.$apply();
        $WowheadPower.refreshLinks();
    });
});
