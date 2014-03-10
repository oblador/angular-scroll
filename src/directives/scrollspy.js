angular.module('duScroll.scrollspy', ['duScroll.scrollPosition']).
directive('duScrollspy', function($rootScope, scrollPosition) {
  var spies = [];
  var currentlyActive;
  var isObserving = false;

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

  function gotScroll($event, scrollY) {
    var toBeActive;
    for(var spy, scroll, pos, i = 0; i < spies.length; i++) {
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
    if(currentlyActive === toBeActive) return;
    if(currentlyActive) currentlyActive.$element.removeClass('active');
    if(toBeActive) toBeActive.$element.addClass('active');
    currentlyActive = toBeActive;
  }

  function addSpy(spy) {
    if(!isObserving) {
      $rootScope.$on('$duScrollChanged', gotScroll);
      isObserving = true;
    }
    spies.push(spy);
  }

  function removeSpy(spy) {
    if(spy === currentlyActive) {
      currentlyActive = null;
    }
    var i = spies.indexOf(spy);
    if(i !== -1) {
      spies.splice(i, 1);
    }
  }

  return {
    link: function ($scope, $element, $attr) {
      var href = $attr.ngHref || $attr.href;
      if (!href || href.indexOf('#') === -1) return;
      var targetId = href.replace(/.*(?=#[^\s]+$)/, '').substring(1);
      if(!targetId) return;

      var spy = new Spy(targetId, $element, -($attr.offset ? parseInt($attr.offset, 10) : 0));
      addSpy(spy);

      $scope.$on('$destroy', function() {
        removeSpy(spy);
      });
      $scope.$on('$locationChangeSuccess', spy.flushTargetCache.bind(spy));
    }
  };
});
