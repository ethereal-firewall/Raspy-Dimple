angular.module("App")
	.controller("final_result_displayCtrl", function($scope, $state, fireBaseFactory) {
    var game = fireBaseFactory.getGame();
    if (game === null) $state.go('home');
		$scope.players = fireBaseFactory.getPlayerNames();
		$scope.toHome = function() {
			$state.go("home");
		};
	})