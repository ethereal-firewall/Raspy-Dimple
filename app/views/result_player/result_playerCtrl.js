angular.module('App')

  .controller('result_playerCtrl', function($scope, $state, $interval, fireBaseFactory) {
    var game = fireBaseFactory.getGame();
    if (game === null) $state.go('home');

    var playerKey = fireBaseFactory.getPlayerKey();
    var currentView = fireBaseFactory.getCurrentView();
    var playerList = {}; // Store our player list.
    $scope.answers = fireBaseFactory.getPlayerAnswers();

    game.$loaded()
    .then(function(data) {
      $scope.question = data.questions[data.currentRound];
      // get current round
      $scope.currentRound = data.currentRound;
      $scope.endRound = data.endRound;
      $scope.players = data.players;
      // $scope.timeLeft = fireBaseFactory.getTimeLeft();
      $scope.timeLeft = {};
      fireBaseFactory.clearSubmit(playerKey);
      fireBaseFactory.getTimer().setCallback(function(time) {
        $scope.timeLeft.$value = time;
      });
      currentView.on('value', function (data) {
        console.log('view changed from results');
        if (data.val() === 'finalResults') {
          $state.go('final_result_player');
          currentView.off();
        } else if (data.val() === 'question') {
          $state.go('question_player');
          currentView.off();
        }
      });
    });

    // navigate to new question or to final result
    $scope.toNextDisplay = function() {
      if ($scope.currentRound >= $scope.endRound) {
        $state.go('final_result_player');
      } else {
        $state.go('question_player');
      }
    };

    // Setting up an interval to poll Firebase and see if
    // we can automatically change views yet.
    // Store interval promise so that we can destroy it once we're done.
    // var intPlayerResultPromise = $interval(function() {
    //   $scope.curView = fireBaseFactory.getCurrentView();
    //   if ($scope.curView === 'question'){
    //     $interval.cancel(intPlayerResultPromise); // Destroy our interval, now that we no longer need it.
    //     $state.go('question_player');
    //   }
    // },250,0);

  });
