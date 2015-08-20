angular.module("App")
.controller("voting_displayCtrl", function($scope, $state, $interval, fireBaseFactory) {
  
  // get game from firebase to display question
  var game = fireBaseFactory.getGame();
  game.$loaded().then(function(data) {
    $scope.question = data.questions[data.currentRound];
    $scope.currentRound = data.currentRound;
    $scope.answers = data.answers;
    $scope.timeLeft = {};
  });

  // fireBaseFactory.getTimeLeft().$bindTo($scope,'timeLeft');

  // The Display has control over the timer that all the players sync to. The display thus checks with ever timer tick.
  // You must remember to call stopTimer() in order to safely end the timer before trying to start the timer again.
  fireBaseFactory.getTimer().startTimer(fireBaseFactory.getGameTime(), function(time) {
    $scope.timeLeft.$value = time;
    fireBaseFactory.allSubmitted().then(function(submitted) {
      console.log("submitted: ",submitted);
      if ($scope.timeLeft.$value <= 0 || submitted) {
        fireBaseFactory.getTimer().stopTimer();
        fireBaseFactory.resetTimeLeft();
        fireBaseFactory.updateCurrentView('results');
        $scope.toResultDisplay();
      }
    });
  });

  // // for moving on to the next screen
  // var intQuestionPromise = $interval(function() {
  //   $scope.timeLeft.$value--;
  //   fireBaseFactory.allSubmitted().then(function(submitted) {
  //     if ($scope.timeLeft.$value <= 0){
  //       fireBaseFactory.clearSubmit();
  //       $interval.cancel(intQuestionPromise); // Cancel the interval once we're done with it.
  //       fireBaseFactory.resetTimeLeft();
  //       fireBaseFactory.updateCurrentView('results'); // Force client to update!
  //       $scope.toResultDisplay(); // Host view will update!
  //     }
  //   });
  // },1000, fireBaseFactory.getGameTime());

  // I think we need this to populate our answers.
  setInterval(function() {
    game = fireBaseFactory.getGame();
    game.$loaded()
    .then(function(data) {
      $scope.answers = data.answers;
    });
  }, 1500);

  $scope.isImagePrompt = function () {
    return !!$scope.question.image;
  };

  $scope.toResultDisplay = function() {
    fireBaseFactory.updateCurrentView('results');
    $state.go("result_display");
  };

});