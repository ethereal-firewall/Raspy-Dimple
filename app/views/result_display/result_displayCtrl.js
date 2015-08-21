angular.module("App")
.controller("result_displayCtrl", function($scope, $state, $interval, fireBaseFactory) {
	var game = fireBaseFactory.getGame();
	if (game === null) $state.go('home');

	var playerList = {};
  $scope.answers = fireBaseFactory.getPlayerAnswers();

	game.$loaded().then(function(data) {
		$scope.currentRound = data.currentRound;
		$scope.question = data.questions[data.currentRound];
		playerList = data.players;
		$scope.timeLeft = {};
	});

	// fireBaseFactory.getTimeLeft().$bindTo($scope,'timeLeft');
	fireBaseFactory.getTimer().startTimer(fireBaseFactory.getGameTime(), function(time) {
		$scope.timeLeft.$value = time;
		if ($scope.timeLeft.$value <= 0) {
			$scope.endResultsView();
		}
	});

	// var intQuestionPromise = $interval(function() {
	// 	$scope.timeLeft.$value--;
	// 	if ($scope.timeLeft.$value <= 0){
	// 		$scope.endResultsView();
	// 	}
	// }, 1000, fireBaseFactory.getGameTime());

	$scope.endResultsView = function () {
		//$interval.cancel(intQuestionPromise); // Cancel the interval once we're done with it.
		fireBaseFactory.getTimer().stopTimer();
		fireBaseFactory.updateCurrentView('nextDisplay'); // Force client to update!
		fireBaseFactory.resetTimeLeft();
		$scope.toNextDisplay(); // Host view will update!
	};

	// redirect to question_display
	$scope.toNextDisplay = function() {
		if ($scope.currentRound >= fireBaseFactory.getEndRound()) {
			fireBaseFactory.updateCurrentView('finalResults');
			$state.go("final_result_display");
		} else { // else display_question
			fireBaseFactory.incrementRound();
			fireBaseFactory.clearAnswers();
			fireBaseFactory.updateCurrentView('question');
			$state.go("question_display");
		}
	};

	$scope.getPlayerName = function(playerKey) {
	  return playerList[playerKey].name;
	};
});