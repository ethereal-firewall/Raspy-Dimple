angular.module("App", ["ui.router", "firebase", 'ngAnimate'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state("home", {
      url: "/",
      views: {
        'content': {
          templateUrl: "views/home.html",
          controller: "homeCtrl"
        }
      }
    })
    .state("create", {
      url: "/create",
      views: {
        'content': { 
          templateUrl: "views/create.html",
          controller: "createCtrl"
        }
      }
    })
    .state("join", {
      url: "/join",
      views: {
        'content': { 
          templateUrl: "views/join.html",
          controller: "joinCtrl"
        }
      }  
    })
    .state("question_display", {
      url: "/question_display",
      views: {
        'content': { 
          templateUrl: "views/question_display.html",
          controller: "question_displayCtrl"
        },
        'footer': {
          templateUrl: "views/score_display.html",
          controller: "score_displayCtrl"
        }
      }
    })
    .state("question_player", {
      url: "/question_player",
      views: {
        'content': { 
          templateUrl: "views/question_player.html",
          controller: "question_playerCtrl"
        }
      }
    })
    .state("result_display", {
      url: "/result_display",
      views: {
        'content': { 
          templateUrl: "views/result_display.html",
          controller: "result_displayCtrl"
        },
        'footer': {
          templateUrl: "views/score_display.html",
          controller: "score_displayCtrl"
        }
      }
    })
    .state("result_player", {
      url: "/result_player",
      views: {
        'content': { 
          templateUrl: "views/result_player.html",
          controller: "result_playerCtrl"
        }
      }
    })
    .state("voting_display", {
      url: "/voting_display",
      views: {
        'content': { 
          templateUrl: "views/voting_display.html",
          controller: "voting_displayCtrl"
        },
        'footer': {
          templateUrl: "views/score_display.html",
          controller: "score_displayCtrl"
        }
      }
    })
    .state("voting_player", {
      url: "/voting_player",
      views: {
        'content': { 
          templateUrl: "views/voting_player.html",
          controller: "voting_playerCtrl"
        }
      }
    })
    .state("final_result_display", {
      url: "/final_result_display",
      views: {
        'content': { 
          templateUrl: "views/final_result_display.html",
          controller: "final_result_displayCtrl"
        }
      }
    })
    .state("final_result_player", {
      url: "/final_result_player",
      views: {
        'content': { 
          templateUrl: "views/final_result_player.html",
          controller: "final_result_playerCtrl"
        }
      }
    });
  $urlRouterProvider.otherwise("/");
});