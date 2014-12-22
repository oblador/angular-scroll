//Adapted from https://gist.github.com/paulirish/1579671
angular.module('duScroll.polyfill', [])
.factory('polyfill', function($window) {
  'use strict';

  var vendors = ['webkit', 'moz', 'o', 'ms'];

  return function(fnName, fallback) {
    if($window[fnName]) {
      return $window[fnName];
    }
    var suffix = fnName.substr(0, 1).toUpperCase() + fnName.substr(1);
    for(var key, i = 0; i < vendors.length; i++) {
      key = vendors[i]+suffix;
      if($window[key]) {
        return $window[key];
      }
    }
    return fallback;
  };
});

angular.module('duScroll.requestAnimation', ['duScroll.polyfill'])
.factory('requestAnimation', function(polyfill, $timeout) {
  'use strict';

  var lastTime = 0;
  var fallback = function(callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = $timeout(function() { callback(currTime + timeToCall); },
      timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };

  return polyfill('requestAnimationFrame', fallback);
})
.factory('cancelAnimation', function(polyfill, $timeout) {
  'use strict';

  var fallback = function(promise) {
    $timeout.cancel(promise);
  };

  return polyfill('cancelAnimationFrame', fallback);
});
