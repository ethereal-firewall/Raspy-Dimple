angular.module("App")
.controller("question_displayCtrl", function($scope, $rootScope, $state, $timeout, $interval, fireBaseFactory) {
	
	// get game from firebase to display question
	var game = fireBaseFactory.getGame();
	if (game === null) $state.go('home');
	game.$loaded().then(function(data) {
		// get current round
		$scope.currentRound = data.currentRound;
		$scope.question = data.questions[data.currentRound];
		$scope.timeLeft = {};
	});

	fireBaseFactory.getTimer().startTimer(fireBaseFactory.getGameTime());

	$rootScope.$on('tick', function(ev, time) {
		$scope.timeLeft.$value = time;
		fireBaseFactory.allSubmitted().then(function(submitted) {
			if ($scope.timeLeft.$value <= 0 || submitted) {
				fireBaseFactory.getTimer().stopTimer();
				fireBaseFactory.resetTimeLeft();
				fireBaseFactory.updateCurrentView('voting');
				$scope.toVotingDisplay();
			}
		});
		// console.log("tick ", time);
	});

	$scope.isImagePrompt = function () {
	  return !!$scope.question.image;
	};

	$scope.toVotingDisplay = function() {
		fireBaseFactory.updateCurrentView('voting');
		$state.go("voting_display");
	};

});