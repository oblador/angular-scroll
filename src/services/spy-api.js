angular.module('duScroll.spyAPI', ['duScroll.scrollContainerAPI']).
factory('spyAPI', function($rootScope, scrollContainerAPI) {
  var createScrollHandler = function(context) {
    return function() {
      var container = context.container, 
          containerEl = container[0],
          containerOffset = 0;

      if(containerEl instanceof HTMLElement) {
        containerOffset = containerEl.getBoundingClientRect().top;
      }

      var i, currentlyActive, toBeActive, spies, spy, pos;
      spies = context.spies;
      currentlyActive = context.currentlyActive;
      toBeActive = undefined;

      for(i = 0; i < spies.length; i++) {
        spy = spies[i];
        pos = spy.getTargetPosition();
        if (!pos) return;

        if(pos.top + spy.offset - containerOffset < 20 && (pos.top*-1 + containerOffset) < pos.height) {
          if(!toBeActive || toBeActive.top < pos.top) {
            toBeActive = {
              top: pos.top,
              spy: spy
            };
          }
        }
      }
      if(toBeActive) {
        toBeActive = toBeActive.spy;
      }
      if(currentlyActive === toBeActive) return;
      if(currentlyActive) {
        currentlyActive.$element.removeClass('active');
        $rootScope.$broadcast('duScrollspy:becameInactive', currentlyActive.$element);
      }
      if(toBeActive) {
        toBeActive.$element.addClass('active');
        $rootScope.$broadcast('duScrollspy:becameActive', toBeActive.$element);
      }
      context.currentlyActive = toBeActive;
    };
  };

  var contexts = {};

  var createContext = function($scope) {
    var id = $scope.$id;
    var context = {
      spies: []
    };
    
    context.handler = createScrollHandler(context);
    contexts[id] = context;
    
    $scope.$on('$destroy', function() {
      destroyContext($scope);
    });

    return id;
  };

  var destroyContext = function($scope) {
    var id = $scope.$id;
    var context = contexts[id], container = context.container;
    if(container) {
      container.off('scroll', context.handler);
    }
    delete contexts[id];
  };

  var defaultContextId = createContext($rootScope);

  var getContextForScope = function(scope) {
    if(contexts[scope.$id]) {
      return contexts[scope.$id];
    }
    if(scope.$parent) {
      return getContextForScope(scope.$parent);
    }
    return contexts[defaultContextId];
  };

  var getContextForSpy = function(spy) {
    return getContextForScope(spy.$element.scope());
  };

  var addSpy = function(spy) {
    var context = getContextForSpy(spy);
    getContextForSpy(spy).spies.push(spy);
    if(!context.container) {
      context.container = scrollContainerAPI.getContainer(spy.$element.scope());
      context.container.on('scroll', context.handler).triggerHandler('scroll');
    }
  };

  var removeSpy = function(spy) {
    var context = getContextForSpy(spy);
    if(spy === context.currentlyActive) {
      context.currentlyActive = null;
    }
    var i = context.spies.indexOf(spy);
    if(i !== -1) {
      context.spies.splice(i, 1);
    }
  };

  return {
    addSpy: addSpy,
    removeSpy: removeSpy, 
    createContext: createContext,
    destroyContext: destroyContext,
    getContextForScope: getContextForScope
  };
});
