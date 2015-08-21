angular.module('App')
  .controller('question_playerCtrl', function($scope, $state, $interval, $timeout, fireBaseFactory) {
    var game = fireBaseFactory.getGame();
    if (game === null) $state.go('home');
    var playerKey = fireBaseFactory.getPlayerKey();
    var currentView = fireBaseFactory.getCurrentView();

    // This freezes the player on their current view
    // after they've submitted their answer.
    // Changes to true on submit and display a
    // "WAITING FOR OTHER PLAYERS TO VOTE" div.
    $scope.holdView = false;

    game.$loaded()
    .then(function(data) {
      $scope.question = data.questions[data.currentRound];
      // get current round
      $scope.currentRound = data.currentRound;
      //fireBaseFactory.getTimeLeft().$bindTo($scope,'timeLeft');
      $scope.timeLeft = {};
      fireBaseFactory.clearSubmit(playerKey);
      fireBaseFactory.getTimer().setCallback(function(time) {
        $scope.timeLeft.$value = time;
      });
      currentView.on('value', function (data) {
        console.log('view changed from question');
        if (data.val() === 'voting') {
          $state.go('voting_player');
          currentView.off();
        }
      });
    });


    // Setting up an interval to poll Firebase and see if
    // we can automatically change views yet.
    // Store interval promise so that we can destroy it once we're done.
    // var intPlayerQuestionPromise = $interval(function() {
    //   $scope.curView = fireBaseFactory.getCurrentView();
    //   //if ($scope.curView === 'voting'){
    // },250,0);

    $scope.isImagePrompt = function () {
      return !!$scope.question.image;
    };

    $scope.submitPlayerAnswer = function(answer) {
      $scope.holdView = true;
      
      var ref = new Firebase(fireBaseFactory.firebaseRef + '/games/' + game.$id);
      if ($scope.answer !== undefined){
        answer = $scope.answer;
        ref.child('answers').child(playerKey).set({
          playerKey: playerKey,
          response: answer,
          votes: 0
        });
        fireBaseFactory.setSubmit(playerKey); 
      }
    };
  });