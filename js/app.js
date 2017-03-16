var myApp = angular.module('myApp', [
    'ngRoute'
    , 'ngAnimate'
    , 'ui.bootstrap'
]);

myApp.config(
    function ($routeProvider, $locationProvider) {

        $routeProvider
            .when('/', { templateUrl: '8Queens/client/views/table.html'})
            .otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode(true);
    }
);
