sras.controller('Boot', ['$state', function($state){
  loadConfig();

  //Do all init stuff here

  $state.go('update');

}])
