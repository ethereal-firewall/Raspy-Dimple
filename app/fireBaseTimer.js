angular.module('App')
.factory('fireBaseTimer', function($interval) {
  var firebaseRef = 'https://exposeyourselfagain.firebaseio.com';

  // ref.child('.info/serverTimeOffset').on('value', function(snap) {
  //   offset = snap.val() || 0;
  // });



  // var updateStartTime = function(snap) {
  //   currTime = snap.val() || 0;
  // };

  // var toggleTimer = function(snap) {
  //   debugger;
  //   var toggle = !! snap.val();
  //   if (toggle) {
  //     timer = $interval(countDown, 1000);
  //   }
  //   else {
  //     timer && $interval.cancel(timer);
  //     timer = null;
  //   }
  // };

  // var countDown = function() {
  //   console.log(currTime);
  //   currTime--;
  // };

  var CreateTimer = function(id) {
    var timer = {};
    var clock;

    timer.currentTime = 0;
    var callback = null;
    timer.game = new Firebase(firebaseRef + '/games/' + id);

    var toggleTimer = function(snap) {
      var toggle = !!snap.val();
      if (toggle) {
        clock = $interval(countDown, 1000);
      }
      else {
        clock && $interval.cancel(clock);
        clock = null;
      }
    };

    var countDown = function() {
      if (timer.currentTime >= 0) {
        console.log(timer.currentTime);
        callback(timer.currentTime);
        timer.currentTime--;  
      }
      else {
        timer.stopTimer();
      }
    };

    var updateStartTime = function(snap) {
      console.log('Updated');
      timer.currentTime = snap.val() || 0;
    }

    timer.game.child('timer').child('run').set(false);
    timer.game.child('timer').child('startTime').set(0);
    timer.game.child('timer').child('run').on('value', toggleTimer);
    timer.game.child('timer').child('startTime').on('value', updateStartTime);
    
    timer.startTimer = function(val, cb) {
      timer.game.child('timer').child('startTime').set(val);
      console.log("Started Timer at: ",timer.currentTimer);
      timer.currentTimer = val;
      callback = cb;
      timer.game.child('timer').child('run').set(true);
    };
    timer.stopTimer = function() {
      timer.game.child('timer').child('startTime').set(0);
      timer.game.child('timer').child('run').set(false);
    };
    timer.setCallback = function(cb) {
      callback = cb;
    }

    return timer;
  };

  // Master Functions
  return {
    CreateTimer: CreateTimer,
  };




});