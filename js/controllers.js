var myApp = angular.module('myApp')

    .controller('WelcomeController', function ($scope) {
        $scope.greeting = 'This is a template for a simple marketing or informational website. It includes a large callout called a jumbotron and three supporting pieces of content. Use it as a starting point to create something more unique.';
    })
    .controller('TableController', function ($scope, alertService, $timeout, historyService) {

        var ADD_ACTION = 'add';
        var REMOVE_ACTION = 'remove';
        var rows = [];
        var array_length = 8;

        createData();

        $scope.rows = rows;
        $scope.queenCount = 0;
        $scope.selectedCell = undefined;
        $scope.historyService = historyService;

        function createData() {
            for (var y = 0; y < array_length; ++y) {
                rows[y] = {
                    cells: []
                }

                for (var x = 0; x < array_length; ++x) {
                    var MyCell = {
                        'hasQueen': false,
                        'isBeingThreat': false,
                        'y': y,
                        'x': x
                    };
                    rows[y].cells.push(MyCell)
                }
            }
        }

        $scope.isQueenSelected = function () {
            if (($scope.selectedCell !== undefined) && ($scope.selectedCell.hasQueen)) {
                return true;
            }
            return false;
        }

        var isCellClear = function (cell) {
            return ((!cell.hasQueen) && (!cell.isBeingThreat));
        }

        $scope.isBoardValid = function () {
            if ($scope.queenCount == 8)
                return true; // Special Case

            for (var i = 0; i < rows.length; i++) {
                for (var j = 0; j < rows[i].cells.length; j++) {
                    var cell = rows[i].cells[j];
                    // One Valid cell make the board valid
                    if ($scope.isValidCell(cell)) {
                        return true;
                    }
                }
            }
            return false;
        }

        $scope.isValidCell = function (cellToValidate) {
            for (var i = 0; i < rows.length; i++) {
                for (var j = 0; j < rows[i].cells.length; j++) {
                    var cell = rows[i].cells[j];
                    if (cell.hasQueen) {
                        if (cellUnderQueenInfluence(cell, cellToValidate)) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }

        $scope.removeQueen = function (cell, shouldUpdateHistory) {
            if (cell !== undefined) {
                cell.hasQueen = false;
            }
            $scope.queenCount--;
            if (shouldUpdateHistory)
                historyService.add(REMOVE_ACTION, cell);
            refreshData();
        }

        $scope.undo = function () {
            if (!historyService.isEmpty()) {
                var action = historyService.popMove();
                if (action.type == ADD_ACTION) {
                    $scope.removeQueen(action.cell, false)
                }
                else {
                    addQueen(action.cell, false)
                }
            }
        }

        $scope.resetBoard = function () {
            for (var i = 0; i < rows.length; i++) {
                for (var j = 0; j < rows[i].cells.length; j++) {
                    var cell = rows[i].cells[j];
                    cell.hasQueen = false
                }
            }
            $scope.queenCount = 0;
            refreshData();
        }

        $scope.isSelected = function (cell) {
            if ($scope.selectedCell === undefined) {
                return false;
            }
            if ((cell.x === $scope.selectedCell.x) && (cell.y === $scope.selectedCell.y)) {
                return true
            }
            return false;
        }
        $scope.cellClicked = function (cell) {
            $scope.selectedCell = cell;

            if (cell.hasQueen) {
                showWhoQueenIsThreatening(cell);
            }
            else if ($scope.isValidCell(cell)) {
                addQueen(cell, true);
            }
            else {
                showWhoIsThreateningCell(cell);
            }
        }

        var fetchTableData = function () {
            return rows;
        };

        var showGameOverAlert = function () {
            alertService.add("danger", "Game Over - Try again!");
            $timeout(function () {
                alertService.remove();
            }, 3000);
        };

        var showSolveGameAlert = function () {
            alertService.add("success", "Whooooooooooooo hoooooo");
            $timeout(function () {
                alertService.remove();
            }, 3000);
        };

        var addQueen = function (cellClicked, shouldUpdateHistory) {
            rows[cellClicked.y].cells[cellClicked.x].hasQueen = true;
            $scope.queenCount++;
            refreshData();

            if (shouldUpdateHistory)
                historyService.add(ADD_ACTION, cellClicked);

            if ($scope.queenCount == 8) {
                showSolveGameAlert();
            }
            else if (!$scope.isBoardValid()) {
                showGameOverAlert();
            }
        }

        function isEqual(cell1, cell2) {
            return (cell1.x === cell2.x) && (cell1.y === cell2.y);
        }

        function cellUnderQueenInfluence(queen, cellToValidate) {
            if (!queen.hasQueen)
                return false;
            return (queen.x === cellToValidate.x) || (queen.y === cellToValidate.y)
                || (Math.abs(queen.x - cellToValidate.x) == Math.abs(queen.y - cellToValidate.y));
        }

        var refreshData = function () {
            iterateRows(function (cell) {
                clearCell(cell);
            })
        }

        var iterateRows = function (callBack) {
            for (var i = 0; i < rows.length; i++) {
                rows[i].cells.forEach(function (cell) {
                    callBack(cell);
                })
            }
        }

        var showWhoIsThreateningCell = function (threatenCell) {
            iterateRows(function (cell) {
                if (isEqual(cell, threatenCell)) {
                    cell.isBeingThreat = false;
                }
                else if (cell.hasQueen) {
                    if (cellUnderQueenInfluence(cell, threatenCell)) {
                        cell.isBeingThreat = true;
                    }
                    else {
                        cell.isBeingThreat = false;
                    }
                }
                else {
                    clearCell(cell);
                }
            })
        }

        var showWhoQueenIsThreatening = function (queenCell) {
            iterateRows(function (cell) {
                if (isEqual(cell, queenCell)) {
                    cell.isBeingThreat = false;
                }
                else if (cellUnderQueenInfluence(queenCell, cell)) {
                    cell.isBeingThreat = true;
                }
                else {
                    clearCell(cell);
                }
            })
        }

        var clearCell = function (cell) {
            if (!cell.hasQueen)
                cell.hasQueen = false;
            cell.isBeingThreat = false;
        }
    })
    .
    controller('AlertButtonController', function ($scope, alertService, $timeout) {
        $scope.showAlert = function () {
            alertService.add("success", "This is a warning.");
            $timeout(function () {
                alertService.remove();
            }, 3000);
        }
    })
    .controller('AlertPlaceHolderController', function ($scope, alertService) {
        $scope.remove = function (index) {
            alertService.remove(index);
        }
    })
