angular.module("App")
  .controller("score_displayCtrl", function($scope, $state, fireBaseFactory) {
    $scope.players = fireBaseFactory.getPlayerNames();
  });
  