angular.module('App')
.directive('timer', function () {
  return {
    restrict: 'E',
    templateUrl: '/views/timer.html'
  };
});