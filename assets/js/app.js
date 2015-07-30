var sras = angular.module('sras', ['ui.router', 'ui.bootstrap']);

sras.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
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
      controller: 'connect'
    })
    .state('dashboard', {
      template: loadView('dashboard'),
      controller: 'dashboard'
    })
    .state('dashboard.map', {
        template: loadView('map'),
        controller: 'map'
    })
    .state('dashboard.player', {
        template: loadView('player'),
        controller: 'player',
        params: {guid: 0}
    })
    .state('dashboard.guild', {
        template: loadView('guild'),
        controller: 'guild'
    })
    .state('fatal', {
        template: loadView('fatal'),
        controller: 'fatal',
        params: {msg: 'Une erreur fatale inconnue c\'est produite'}
    });
}]);

sras.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
