angular.module("App")
.controller("question_displayCtrl", function($scope, $state, $timeout, $interval, fireBaseFactory) {
	
	// get game from firebase to display question
	var game = fireBaseFactory.getGame();
	if (game === null) $state.go('home');
	game.$loaded().then(function(data) {
		// get current round
		$scope.currentRound = data.currentRound;
		$scope.question = data.questions[data.currentRound];
		$scope.timeLeft = {};
	});

	//fireBaseFactory.getTimeLeft().$bindTo($scope,'timeLeft');
	fireBaseFactory.getTimer().startTimer(fireBaseFactory.getGameTime(), function(time) {
		$scope.timeLeft.$value = time;
		fireBaseFactory.allSubmitted().then(function(submitted) {
			if ($scope.timeLeft.$value <= 0 || submitted) {
				fireBaseFactory.getTimer().stopTimer();
				fireBaseFactory.resetTimeLeft();
				fireBaseFactory.updateCurrentView('voting');
				$scope.toVotingDisplay();
			}
		});
	});

	// $interval that will count down from 30 seconds
	// when time is up, it will call 'toVotingDisplay'


	// Storing our interval's promise as a variable so that we can explicitly cancel it later.
	// Otherwise, it will keep running until it's done.

	// var intQuestionPromise = $interval(function() {
	// 	//$scope.timeLeft.$value--;	

	// 	fireBaseFactory.allSubmitted().then(function(submitted) {
	// 		if ($scope.timeLeft.$value <= 0 || submitted){
	// 			fireBaseFactory.clearSubmit();
	// 			$interval.cancel(intQuestionPromise); // Cancel the interval once we're done with it.
	// 			//$interval.cancel(timer);
	// 			fireBaseFactory.resetTimeLeft();
	// 			fireBaseFactory.updateCurrentView('voting'); // Force client to update!
	// 			$scope.toVotingDisplay(); // Host view will update!
	// 		}
	// 	})
	// },1000, fireBaseFactory.getGameTime());

	$scope.isImagePrompt = function () {
	  return !!$scope.question.image;
	};

	$scope.toVotingDisplay = function() {
		fireBaseFactory.updateCurrentView('voting');
		$state.go("voting_display");
	};

});