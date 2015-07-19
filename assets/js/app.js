var sras = angular.module('sras', ['ui.router', 'ui.bootstrap']);

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
      controller: 'connect'
    })
    .state('dashboard', {
      template: loadView('dashboard'),
      controller: 'dashboard'
    })
    .state('dashboard.map', {
        template: loadView('map'),
        controller: 'map'
    });
});

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
