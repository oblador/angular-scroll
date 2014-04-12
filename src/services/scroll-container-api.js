angular.module('duScroll.scrollContainerAPI', []).
factory('duScrollContainerAPI', function() {
  var containers = {};

  var setContainer = function(scope, element) {
    var id = scope.$id;
    containers[id] = element;
    return id;
  };

  var getContainerId = function(scope) {
    if(containers[scope.$id]) {
      return scope.$id;
    }
    if(scope.$parent) {
      return getContainerId(scope.$parent);
    }
    return;
  };

  var getContainer = function(scope) {
    var id = getContainerId(scope);
    return id ? containers[id] : id;
  };

  return {
    getContainerId: getContainerId, 
    getContainer: getContainer, 
    setContainer: setContainer
  };
});
