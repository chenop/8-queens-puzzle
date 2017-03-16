var myApp = angular.module('myApp')
    .factory('alertService', function ($rootScope) {
        var id = 0;
        var alertService = {};

        // create an array of alerts available globally
        $rootScope.alerts = [];

        alertService.add = function (type, msg) {
            $rootScope.alerts.push({'type': type, 'msg': msg + id++});
        };

        alertService.remove = function (index) {
            if (index == undefined)
                index = 0;
            $rootScope.alerts.splice(index, 1);
        };

        return alertService;
    })
    .factory('historyService', function ($rootScope) {
        var id = 0;
        var historyService = {};

        // create an array of alerts available globally
        $rootScope.moves = [];

        historyService.add = function (type, cell) {
            $rootScope.moves.push({'type': type, 'cell': cell});
        };

        historyService.popMove = function () {
            var move = $rootScope.moves.pop();
            return  move;
        };

        historyService.isEmpty = function() {
            return $rootScope.moves == 0;
        }

        return historyService;
    })