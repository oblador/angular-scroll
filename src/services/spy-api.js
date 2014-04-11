angular.module('duScroll.spyAPI', ['duScroll.scrollPosition']).
factory('duSpyAPI', function($rootScope, scrollPosition) {
  var contexts = {};
  var isObserving = false;

  var createContext = function($scope) {
    var id = $scope.$id;
    contexts[id] = {
      spies: []
    };
    return id;
  };
  var defaultContextId = createContext($rootScope);
  var scrollContexts = {};

  var gotScroll = function($event, scrollY) {
    var i, id, context, currentlyActive, toBeActive, spies, spy, pos;

    for(id in contexts) {
      context = contexts[id];
      spies = context.spies;
      currentlyActive = context.currentlyActive;
      toBeActive = undefined;

      for(i = 0; i < spies.length; i++) {
        spy = spies[i];
        pos = spy.getTargetPosition();
        if (!pos) continue;

        if(pos.top + spy.offset < 20 && pos.top*-1 < pos.height) {
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
      if(currentlyActive === toBeActive) continue;
      if(currentlyActive) {
        currentlyActive.$element.removeClass('active');
        $rootScope.$broadcast('duScrollspy:becameInactive', currentlyActive.$element);
      }
      if(toBeActive) {
        toBeActive.$element.addClass('active');
        $rootScope.$broadcast('duScrollspy:becameActive', toBeActive.$element);
      }
      context.currentlyActive = toBeActive;
    }
  };

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
    if(!isObserving) {
      $rootScope.$on('$duScrollChanged', gotScroll);
      isObserving = true;
    }
    var sC = spy.scrollContext;
    if(sC){
      var scope = angular.element(sC).scope();
      var scId = scope.$id;

      if(!scrollContexts[scId]){
        scrollContexts[scId] = angular.element(sC).on('scroll', function(){
          gotScroll(null,sC.scrollTop);
        });
        scope.$on('$destroy', function(){
          delete scrollContexts[scId];
        });
      }
    }
    getContextForSpy(spy).spies.push(spy);
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
    createContext: createContext
  };
});
