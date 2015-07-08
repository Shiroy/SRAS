var sras = angular.module('sras', ['ui.router']);

sras.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('boot', {
      url: '/',
      controller: 'Boot'
    })
    .state('getApiKey', {
      template: loadView('getApiKey'),
      controller: 'getApiKey'
    })
    .state('connect', {
      template: loadView('connect'),
    })
});
