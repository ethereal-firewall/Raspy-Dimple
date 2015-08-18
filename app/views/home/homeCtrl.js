angular.module("App")
.controller("homeCtrl", function($scope, $state, fireBaseFactory){
  $scope.gameOptions = {};

  var transferOptions = function (destination, start) {
    for (var option in start) {
      destination[option] = start[option] || destination[option];
    }
  };

  $scope.createGame = function() {
    $scope.toggleGameOptions();
    transferOptions(fireBaseFactory.gameOptions, $scope.gameOptions);
    fireBaseFactory.createGame();
    $state.go('create');
  };

  $scope.toggleGameOptions = function () {
    $scope.gameOptions.show = !$scope.gameOptions.show;
  };

  transferOptions($scope.gameOptions, fireBaseFactory.gameOptions);

})
.directive('gameOptions', function () {
  return {
    restrict: 'E',
    templateUrl: 'views/gameOptions.html'
  };
});