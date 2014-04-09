angular.module('duScroll.scrollContextAPI', []).
factory('duScrollContextAPI', function() {
  var contexts = {};

  var setContext = function(scope, element) {
    var id = scope.$id;
    contexts[id] = element;
    return id;
  };

  var getContext = function(scope) {
    if(contexts[scope.$id]) {
      return contexts[scope.$id];
    }
    if(scope.$parent) {
      return getContext(scope.$parent);
    }
    return;
  };

  return {
    getContext: getContext, 
    setContext: setContext
  };
});
