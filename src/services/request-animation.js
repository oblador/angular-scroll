angular.module('duScroll.requestAnimation', []).
factory('requestAnimation', function($window, $timeout) {
  return $window.requestAnimationFrame  ||
    $window.webkitRequestAnimationFrame ||
    $window.mozRequestAnimationFrame    ||
    $window.oRequestAnimationFrame      ||
    $window.msRequestAnimationFrame     ||
    function fallback( callback ){
      $timeout(callback, 1000 / 60);
    };
});