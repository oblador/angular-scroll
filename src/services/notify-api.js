angular.module('duScroll.notifyAPI', [])
.factory('notifyAPI', function($rootScope, $timeout, duScrollDebouce) {
  'use strict';

  var stopedScrollTimer;

  var createScrollDebouceHandler = function() {
    return function() {
      $timeout.cancel(stopedScrollTimer);
      stopedScrollTimer = $timeout(function() {
        $rootScope.$broadcast('duScrollspy:scrollStopped');
      }, duScrollDebouce, false);
    };
  };

  var context = {};

  var addNotifier = function(container) {
    context.debouceHandler = createScrollDebouceHandler();
    container.on('scroll', context.debouceHandler);
  };

  var removeNotifier = function(container) {
    container.off('scroll', context.debouceHandler);
  };

  return {
    addNotifier: addNotifier,
    removeNotifier: removeNotifier,
  };
});
