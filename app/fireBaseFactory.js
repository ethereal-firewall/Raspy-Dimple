angular.module("App")
.factory("fireBaseFactory", function($firebaseObject, $firebaseArray, fireBaseTimer) {
  var firebaseRef = 'https://exposeyourselfagain.firebaseio.com';
  var ref = new Firebase(firebaseRef + "/games");
  var game = null;
  var timer = null;
  var playerKey = null;
  var gameOptions = {};
  gameOptions.timeLeft = 60;
  gameOptions.endRound = 10;
  
  // Generate a random string of 5 characters that we will use for our game ID's.
   var createGameID = function () {
      var gameID = '';
      var validChars = 'ABCDEFGHJKLMNOPQRSTUVWXYZ123456789';

      for(var i = 0; i < 6; i++) {
        gameID += validChars.charAt(Math.floor(Math.random() * validChars.length));
      }

      return gameID;
  };


  var createGame = function() {
    var gameObject = {
      join: true,
      active: false,
      currentRound: 1,
      endRound: gameOptions.endRound,
      currentView: 'question',
      timeLeft: gameOptions.timeLeft
    };
    var gameID = createGameID();

    // Instantiate a new game with our newly generated short code ID.
    // Note: If we don't utilize a short code, and instead use the FireBase "push" method,
    // we end up with really long and unwieldy IDs that users will never type in.
    ref.child(gameID).set(gameObject);

    // Once we've instantiated the game, let's get the object back so we can utilize it.
    var newRef = new Firebase(firebaseRef + "/games/" + gameID);
    game = $firebaseObject(newRef);

    timer = fireBaseTimer.CreateTimer(gameID);
    console.log(timer);
    return game;
  };

  var joinGame = function(id, name, profilePhoto, questionPhoto, callback) {
    // Convert our ID to Upper Case since that's what's created by our short code generator.
    id = id.toUpperCase();

    profilePhoto = profilePhoto || '';
    questionPhoto = questionPhoto || '';
    
    var newRef = new Firebase(firebaseRef + "/games/" + id);
    newRef.once('value', function (data) {
      if (!data.exists()) callback(false);
      else {
        playerKey = newRef.child("players").push({name: name, votes: 0, profilePhoto: profilePhoto, questionPhoto: questionPhoto, submit:false}).key();
        game = $firebaseObject(newRef);
        timer = fireBaseTimer.CreateTimer(id);
        callback(true);
      }
    });
  };

  console.log('hi');

  // Check if the HOST has put the game into an active state.
  // If not, force the player / client to wait on their current screen.
  var checkActive = function(id) {
    if (id === undefined) { return; } // Prevent errors if ID is null.
    var id = id.toUpperCase();
    var activeGame;

    // Query our current game ID to find out if the game is in an active state.
    // This query method can be found here: https://www.firebase.com/blog/2013-10-01-queries-part-one.html#byid
    new Firebase(firebaseRef + "/games/" + id + "/active").once('value', function(data) {
      activeGame = data.val();
    });

    // Return the state of our game to the controller.
    return activeGame;
  };

  // This method is called by each player view to find out if it's okay
  // to move onto the next view. This acts as a gate so that players aren't
  // able to move ahead or go out of sync with the game.
  var getCurrentView = function() {
    var curView;
    // Query game to find out if the game is in an active state.
    // This query method can be found here: https://www.firebase.com/blog/2013-10-01-queries-part-one.html#byid
    new Firebase(firebaseRef + "/games/" + game.$id + "/currentView").once('value', function(data) {
      curView = data.val();
    });

    // Return the state of our game to the controller.
    return curView;    
  }

  var updateCurrentView = function(view) {
    // Query game to find out if the game is in an active state.
    // This query method can be found here: https://www.firebase.com/blog/2013-10-01-queries-part-one.html#byid
    var ref = new Firebase(firebaseRef + "/games/" + game.$id);
    ref.update({currentView: view});
  }

  var getGame = function() {
    return game;
  };

  var getPlayerKey = function() {
    return playerKey;
  };

  // This function does 2 things:
  // 1. Sets our join condition so no more players can join the game.
  // 2. Sets the active state of the game so that we can now push players into the questions.
  var getPlayer = function() {
    return player;
  };

  var setJoin = function(canJoin, id){
    var newRef = new Firebase(firebaseRef + "/games/" + id);
    newRef.update({join: canJoin});
    newRef.update({active: true});
  };

  var incrementPlayerScore = function(playerKey) {
    var ref = new Firebase(firebaseRef + '/games/' + game.$id);
    ref.child('answers').child(playerKey).child('votes').transaction(function(currentVotes) {
      return ++currentVotes;
    });
    ref.child('players').child(playerKey).child('votes').transaction(function(currentVotes) {
      return ++currentVotes;
    });
  };

  var incrementRound = function() {
    var ref = new Firebase(firebaseRef + '/games/' + game.$id);
    ref.child('currentRound').transaction(function(currentRound) {
      return ++currentRound;
    })
  };

  var allSubmitted = function() {
    return new Promise(function(resolve, reject) {

      var ref = new Firebase(firebaseRef + '/games/' + game.$id);
      var playerArr = $firebaseArray(ref.child('players'));
      // debugger;
      playerArr.$loaded().then(function(playerArr) {
        for (var i = 0; i < playerArr.length; i++) {
          if (!playerArr[i].submit) {
            resolve(false);
          }
        }
        resolve(true);
      });
    }); 
  };

  var setSubmit = function(playerKey) {
    var ref = new Firebase(firebaseRef + '/games/' + game.$id);
    ref.child('players').child(playerKey).child('submit').set(true);
  }

  var clearSubmit = function(playerKey) {
    var ref = new Firebase(firebaseRef + '/games/' + game.$id);
    ref.child('players').child(playerKey).child('submit').set(false); 
  }

  var clearAnswers = function() {
    var ref = new Firebase(firebaseRef + '/games/' + game.$id);
    ref.child('answers').remove();
  };

  var getPlayerNames = function() {
    var ref = new Firebase(firebaseRef + '/games/' + game.$id);
    return $firebaseArray(ref.child('players'));
  };

  var getPlayerAnswers = function() {
    var ref = new Firebase(firebaseRef + '/games/' + game.$id);
    return $firebaseArray(ref.child('answers'));
  };

  var getTimeLeft = function() {
    var ref = new Firebase(firebaseRef + '/games/' + game.$id);
    return $firebaseObject(ref.child('timeLeft'));
  };

  var getGameTime = function() {
    return gameOptions.timeLeft; 
  };

  var getTimer = function() {
    return timer;
  }

  var getEndRound = function(){
    return gameOptions.endRound;
  };

  var resetTimeLeft = function(){
    var ref = new Firebase(firebaseRef + '/games/' + game.$id);
    ref.child('timeLeft').set(gameOptions.timeLeft);
  };

  var questionGenerator = function(users) {
    var parts = {
      '(O)': [ 'cat', 'inflatable raft', 'frog', 'pony', 'pizza' ],
      '(VT)': [ 'kick', 'poke', 'sit on', 'pet', 'destroy', 'defenestrate', 'slap', 'caress' ],
      '(VI)': [ 'eat', 'lick' ],
      '(P)': [ 'eating', 'licking', 'teasing', 'talking to' ],
      '(T)': [ 'yesterday', 'last summer', 'tonight', 'today', 'long ago', 'in the before time' ]
    };

    parts['(S)'] = users;

    var sentenceFrames = [
      'Why did (S) (VT) the (O)?',
      'Why does (S) love (VI)ing (S)?',
      'What did (S) (VT) the (O) with?',
      'Where did (S) (VI)?',
      'What did (S) do (T)?',
      'Why did (S) (VT) (S) with the (O)?',
      'What does (S) do with the (O)?',
      'What is (S)\'s favourite (O)?',
      'Why does (S) like (P) (O)s?',
      '(S) is always (P). Why?',
    ];

    var randomItem = function(arr) {
      return arr[Math.floor( Math.random() * (arr.length) )];
    };

    // Matches anything between and including rounded brackets ()
    var regex = new RegExp(/[(]\w+[)]/g);
    var randomQuestion = randomItem(sentenceFrames);

    var subjectForScoring = null;

    randomQuestion.match(regex).forEach(function(placeholder) {
      var randomFiller = randomItem(parts[placeholder]);
      if (typeof randomFiller === 'object') {
        if (subjectForScoring === null) subjectForScoring = randomFiller.key;
        randomFiller = randomFiller.name;
      }
      randomQuestion = randomQuestion.replace(placeholder, randomFiller);
    });
    return {
      subject: subjectForScoring,
      question: randomQuestion
    };
  };

  var addQuestions = function(callback) {

    // get access to the names for the current game
    var ref = new Firebase(firebaseRef + '/games/' + game.$id + '/players');
    ref.once('value', function(players) {
      var tempPlayers = [];
      players = players.val();
      angular.forEach(players, function(player, key) {
        player.key = key;
        tempPlayers.push(player);
      });

      var tempQuestions = {};

      for (var i = 1; i <= gameOptions.endRound; i++) {
        tempQuestions[i] = questionGenerator(tempPlayers);
      };

      var randomSpot = Math.random() * Math.ceil(gameOptions.endRound / 2);
      randomSpot = Math.ceil(randomSpot);
      randomSpot += Math.floor(gameOptions.endRound / 2);

      var questionToChange = tempQuestions[randomSpot];
      var randomPlayer = players[questionToChange.subject];
      questionToChange.image = randomPlayer.questionPhoto;
      questionToChange.question = 'Caption this photo!';

      // add ten random questions and add a random name to each one where 'JARVIS' is located
      var ref = new Firebase(firebaseRef + '/games/' + game.$id);

      // This checks if we've added all 10 questions to the game object
      // in the Firebase database first. If so, then we call our callback function
      // which will pass both host and player into the game with the correct questions.
      // var checkCallback = function() {
      //   if (tempQuestions.length === gameOptions.endRound) {
      //     callback();
      //   }
      // };

      ref.child('questions').update(tempQuestions);
      // checkCallback(); // Trying to invoke a callback function here...
      callback();
      
    });
  };



  // How to add questions from Google Sheet:
    // Step 1: use the 'toJSON' extension in our GoogleSheet to convert all the questions
    //         to JSON format.
    // Step 2: uncomment the code below
    // Step 3: copy the data from the results of the previous step and paste 
    //         the JSON data as the value of the 'QUESTIONS' variable below
    // Step 4: Enjoy the rest of your day. You're questions are added


  // var QUESTIONS = "ADD THE JSON DATA HERE";
  // var QUESTIONS = [
  //   "What does JARVIS like to do on a Saturday night?",
  //   "What is JARVIS's favorite type of food?",
  //   "What is JARVIS's favorite animal?",
  //   "What does JARVIS think about in the shower?",
  //   "What is JARVIS's favorite song?",
  //   "Why did JARVIS fail clown school?",
  //   "What did JARVIS's parents say to them when they were born?",
  //   "What was JARVIS doing last night?",
  //   "This is JARVIS's favorite pickup line: _____________",
  //   "What is JARVIS's super power?"
  // ];
  // var pushToFirebase = function(array) {
  //     var ref = new Firebase(firebaseRef + '/');
  //     for(var i = 0; i < array.length; i++) {
  //         ref.child('questionDB').push(array[i]);
  //     }
  // };
  // pushToFirebase(QUESTIONS);

  return {
    gameOptions: gameOptions,
    firebaseRef: firebaseRef, 
    addQuestions: addQuestions,
    checkActive: checkActive,
    createGame: createGame,
    clearAnswers: clearAnswers,
    getCurrentView: getCurrentView,
    getGame: getGame,
    getGameTime: getGameTime,
    getEndRound: getEndRound,
    getPlayerKey: getPlayerKey,
    getPlayerAnswers: getPlayerAnswers,
    getPlayerNames: getPlayerNames,
    getTimeLeft: getTimeLeft,
    getTimer: getTimer,
    resetTimeLeft: resetTimeLeft,
    incrementPlayerScore: incrementPlayerScore,
    incrementRound: incrementRound,
    allSubmitted: allSubmitted,
    setSubmit: setSubmit,
    clearSubmit: clearSubmit,
    joinGame: joinGame,
    setJoin: setJoin,
    updateCurrentView: updateCurrentView
  };
});