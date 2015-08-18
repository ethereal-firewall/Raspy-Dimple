angular.module("App", ["ui.router", "firebase"])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state("home", {
      url: "/",
      templateUrl: "views/home.html",
      controller: "homeCtrl"
    })
    .state("create", {
      url: "/create",
      templateUrl: "views/create.html",
      controller: "createCtrl"
    })
    .state("join", {
      url: "/join",
      templateUrl: "views/join.html",
      controller: "joinCtrl"
    })
    .state("question_display", {
      url: "/question_display",
      templateUrl: "views/question_display.html",
      controller: "question_displayCtrl"
    })
    .state("question_player", {
      url: "/question_player",
      templateUrl: "views/question_player.html",
      controller: "question_playerCtrl"
    })
    .state("result_display", {
      url: "/result_display",
      templateUrl: "views/result_display.html",
      controller: "result_displayCtrl"
    })
    .state("result_player", {
      url: "/result_player",
      templateUrl: "views/result_player.html",
      controller: "result_playerCtrl"
    })
    .state("voting_display", {
      url: "/voting_display",
      templateUrl: "views/voting_display.html",
      controller: "voting_displayCtrl"
    })
    .state("voting_player", {
      url: "/voting_player",
      templateUrl: "views/voting_player.html",
      controller: "voting_playerCtrl"
    })
    .state("final_result_display", {
      url: "/final_result_display",
      templateUrl: "views/final_result_display.html",
      controller: "final_result_displayCtrl"
    })
    .state("final_result_player", {
      url: "/final_result_player",
      templateUrl: "views/final_result_player.html",
      controller: "final_result_playerCtrl"
    });
  $urlRouterProvider.otherwise("/");
});