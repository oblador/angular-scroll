angular.module('duScroll.spyAPI', ['duScroll.scrollContainerAPI'])
.factory('spyAPI', function($rootScope, $timeout, $window, $document, scrollContainerAPI, duScrollGreedy, duScrollSpyWait, duScrollBottomSpy, duScrollActiveClass) {
  'use strict';

  var createScrollHandler = function(context) {
    var timer = false, queued = false;
    var handler = function() {
      queued = false;
      var container = context.container,
          containerEl = container[0],
          containerOffset = 0,
          bottomReached;

      if (typeof HTMLElement !== 'undefined' && containerEl instanceof HTMLElement || containerEl.nodeType && containerEl.nodeType === containerEl.ELEMENT_NODE) {
        containerOffset = containerEl.getBoundingClientRect().top;
        bottomReached = Math.round(containerEl.scrollTop + containerEl.clientHeight) >= containerEl.scrollHeight;
      } else {
        var documentScrollHeight = $document[0].body.scrollHeight || $document[0].documentElement.scrollHeight; // documentElement for IE11
        bottomReached = Math.round($window.pageYOffset + $window.innerHeight) >= documentScrollHeight;
      }
      var compareProperty = (duScrollBottomSpy && bottomReached ? 'bottom' : 'top');

      var i, currentlyActive, toBeActive, spies, spy, pos;
      spies = context.spies;
      currentlyActive = context.currentlyActive;
      toBeActive = undefined;

      for(i = 0; i < spies.length; i++) {
        spy = spies[i];
        pos = spy.getTargetPosition();
        if (!pos) continue;

        if((duScrollBottomSpy && bottomReached) || (pos.top + spy.offset - containerOffset < 20 && (duScrollGreedy || pos.top*-1 + containerOffset) < pos.height)) {
          //Find the one closest the viewport top or the page bottom if it's reached
          if(!toBeActive || toBeActive[compareProperty] < pos[compareProperty]) {
            toBeActive = {
              spy: spy
            };
            toBeActive[compareProperty] = pos[compareProperty];
          }
        }
      }

      if(toBeActive) {
        toBeActive = toBeActive.spy;
      }
      if(currentlyActive === toBeActive || (duScrollGreedy && !toBeActive)) return;
      if(currentlyActive) {
        currentlyActive.$element.removeClass(duScrollActiveClass);
        $rootScope.$broadcast(
          'duScrollspy:becameInactive',
          currentlyActive.$element,
          angular.element(currentlyActive.getTargetElement())
        );
      }
      if(toBeActive) {
        toBeActive.$element.addClass(duScrollActiveClass);
        $rootScope.$broadcast(
          'duScrollspy:becameActive',
          toBeActive.$element,
          angular.element(toBeActive.getTargetElement())
        );
      }
      context.currentlyActive = toBeActive;
    };

    if(!duScrollSpyWait) {
      return handler;
    }

    //Debounce for potential performance savings
    return function() {
      if(!timer) {
        handler();
        timer = $timeout(function() {
          timer = false;
          if(queued) {
            handler();
          }
        }, duScrollSpyWait, false);
      } else {
        queued = true;
      }
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
    var context, contextId, scope = spy.$scope;
    if(scope) {
      return getContextForScope(scope);
    }
    //No scope, most likely destroyed
    for(contextId in contexts) {
      context = contexts[contextId];
      if(context.spies.indexOf(spy) !== -1) {
        return context;
      }
    }
  };

  var isElementInDocument = function(element) {
    while (element.parentNode) {
      element = element.parentNode;
      if (element === document) {
        return true;
      }
    }
    return false;
  };

  var addSpy = function(spy) {
    var context = getContextForSpy(spy);
    if (!context) return;
    context.spies.push(spy);
    if (!context.container || !isElementInDocument(context.container)) {
      if(context.container) {
        context.container.off('scroll', context.handler);
      }
      context.container = scrollContainerAPI.getContainer(spy.$scope);
      context.container.on('scroll', context.handler).triggerHandler('scroll');
    }
  };

  var removeSpy = function(spy) {
    var context = getContextForSpy(spy);
    if(spy === context.currentlyActive) {
      $rootScope.$broadcast('duScrollspy:becameInactive', context.currentlyActive.$element);
      context.currentlyActive = null;
    }
    var i = context.spies.indexOf(spy);
    if(i !== -1) {
      context.spies.splice(i, 1);
    }
		spy.$element = null;
  };

  return {
    addSpy: addSpy,
    removeSpy: removeSpy,
    createContext: createContext,
    destroyContext: destroyContext,
    getContextForScope: getContextForScope
  };
});
