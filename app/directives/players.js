angular.module('App')
.directive('players', function () {
  return {
    restrict: 'E',
    templateUrl: 'app/views/score_display/score_display.html'
  };
});