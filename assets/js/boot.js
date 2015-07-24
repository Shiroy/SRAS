sras.controller('Boot', function($state){
  loadConfig();

  //Do all init stuff here

  $state.go('getApiKey');

})
