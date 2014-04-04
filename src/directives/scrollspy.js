angular.module('duScroll.scrollspy', ['duScroll.scrollPosition']).
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
}).
directive('duSpyContext', function(duSpyAPI) {
  return {
    restrict: 'A',
    scope: true,
    compile: function compile(tElement, tAttrs, transclude) {
      return {
        pre: function preLink($scope, iElement, iAttrs, controller) {
          duSpyAPI.createContext($scope);
        }
      };
    }
  };
}).
directive('duScrollspy', function(duSpyAPI) {
  var Spy = function(targetElementOrId, $element, offset) {
    if(angular.isElement(targetElementOrId)) {
      this.target = targetElementOrId;
    } else if(angular.isString(targetElementOrId)) {
      this.targetId = targetElementOrId;
    }
    this.$element = $element;
    this.offset = offset;
  };

  Spy.prototype.getTargetElement = function() {
    if (!this.target && this.targetId) {
      this.target = document.getElementById(this.targetId);
    }
    return this.target;
  };

  Spy.prototype.getTargetPosition = function() {
    var target = this.getTargetElement();
    if(target) {
      return target.getBoundingClientRect();
    }
  };

  Spy.prototype.flushTargetCache = function() {
    if(this.targetId) {
      this.target = undefined;
    }
  };

  return {
    link: function ($scope, $element, $attr) {
      var href = $attr.ngHref || $attr.href;
      var targetId;

      if (href && href.indexOf('#') !== -1) {
        targetId = href.replace(/.*(?=#[^\s]+$)/, '').substring(1);
      } else if($attr.duScrollspy) {
        targetId = $attr.duScrollspy;
      }
      if(!targetId) return;

      var spy = new Spy(targetId, $element, -($attr.offset ? parseInt($attr.offset, 10) : 0));
      duSpyAPI.addSpy(spy);

      $scope.$on('$routeChangeStart', function() {
        duSpyAPI.removeSpy(spy);
      });
      $scope.$on('$stateChangeStart', function() {
        duSpyAPI.removeSpy(spy);
      });
      $timeout(function(){
        $scope.$emit('$duScrollChanged');
        spy.flushTargetCache.bind(spy)
      },0);
    }
  };
});
