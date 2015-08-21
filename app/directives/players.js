angular.module('App')
.directive('players', function () {
  return {
    restrict: 'E',
    templateUrl: '/views/score_display.html'
  };
});