angular.module("App")
.controller("result_displayCtrl", function($scope, $rootScope, $state, $interval, fireBaseFactory) {
	var game = fireBaseFactory.getGame();
	if (game === null) $state.go('home');

	var playerList = {};
	$scope.answers = [];
  var playerAnswers = fireBaseFactory.getPlayerAnswers();

	game.$loaded().then(function(data) {
		$scope.currentRound = data.currentRound;
		$scope.question = data.questions[data.currentRound];
		playerList = data.players;
		$scope.timeLeft = {};
	});

	fireBaseFactory.getTimer().startTimer(fireBaseFactory.getGameTime());

	$rootScope.$on('tick', function(event, time) {
		$scope.timeLeft.$value = time;
		if (time === fireBaseFactory.getGameTime() || time % 5 === 0) {
			$scope.addResult();
			$scope.owner = true;
			$scope.ownerScore = true;
		}
		if ($scope.timeLeft.$value <= 0) {
			$scope.endResultsView();
		}
	});

	$scope.calculatePoints = function(answer) {
		answer.points = 0;
		for (var vote in answer.voters){
			if (answer.playerKey === $scope.question.subject) {
				answer.points = 1000;
				fireBaseFactory.addScoreToPlayer(vote, 1000);
			}
			else {
				answer.points += 500;
				fireBaseFactory.addScoreToPlayer(answer.playerKey, 500);
			}
		}
	};

	$scope.addResult = function() {
		var holder;
		if (playerAnswers.length > 1) {
			holder = playerAnswers.pop();
			if (holder.playerKey === $scope.question.subject) {
				playerAnswers.unshift(holder);
				$scope.addResult();
			}
			else {
				$scope.answers.pop();
				$scope.calculatePoints(holder);
				$scope.answers.push(holder);
			}
		}
		else if (playerAnswers.length === 1) {
			holder = playerAnswers.pop();
			$scope.answers.pop();
			$scope.calculatePoints(holder);
			$scope.answers.push(holder);
			$scope.trueShow = true;
		}
	};

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

	$scope.getPlayer = function(playerKey) {
		return playerList[playerKey];
	};
});
