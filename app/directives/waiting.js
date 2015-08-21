angular.module('App')
.directive('waiting', function () {
  return {
    restrict: 'E',
    template: '<div class="waiting" ng-show="holdView">Waiting for other players to answer...</div>'
  };
});
