angular.module('duScroll.scrollContainerAPI', [])
.factory('scrollContainerAPI', function($document) {
  'use strict';

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
    return id ? containers[id] : $document;
  };

  var removeContainer = function(scope) {
    var id = getContainerId(scope);
    if(id) {
      delete containers[id];
    }
  };

  return {
    getContainerId:   getContainerId,
    getContainer:     getContainer,
    setContainer:     setContainer,
    removeContainer:  removeContainer
  };
});
