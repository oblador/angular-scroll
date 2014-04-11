angular.module('duScroll.scrollspy', ['duScroll.spyAPI', 'duScroll.scrollContextAPI']).
directive('duScrollspy', function($timeout, duSpyAPI, duScrollContextAPI) {
  var Spy = function(targetElementOrId, $element, offset, scrollContext) {
    if(angular.isElement(targetElementOrId)) {
      this.target = targetElementOrId;
    } else if(angular.isString(targetElementOrId)) {
      this.targetId = targetElementOrId;
    }
    this.$element = $element;
    this.offset = offset;
    this.scrollContext = scrollContext;
  };

  Spy.prototype.getTargetElement = function() {
    if (!this.target && this.targetId) {
      this.target = document.getElementById(this.targetId);
    }
    return this.target;
  };

  Spy.prototype.getTargetPosition = function() {
    var target = this.getTargetElement();
    if(target && this.scrollContext){
      var el = target;
      var top = el.offsetTop;
      while (el.offsetParent !== this.scrollContext) {
        top+= el.offsetTop;
        el = el.offsetParent;
      }
      return {
        top: top - this.scrollContext.scrollTop,
        height: target.offsetHeight
      };
    }
    if(target && !this.scrollContext) {
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
      var targetId, spy;

      if (href && href.indexOf('#') !== -1) {
        targetId = href.replace(/.*(?=#[^\s]+$)/, '').substring(1);
      } else if($attr.duScrollspy) {
        targetId = $attr.duScrollspy;
      }
      if(!targetId) return;

      // Run this in the next execution loop so that the scroll context has a chance
      // to initialize
      $timeout(function() {
        var scrollContext = duScrollContextAPI.getContext($scope);
        spy = new Spy(targetId, $element, -($attr.offset ? parseInt($attr.offset, 10) : 0), scrollContext);

        duSpyAPI.addSpy(spy);

        $scope.$on('$destroy', function() {
          duSpyAPI.removeSpy(spy);
        });
        $scope.$on('$locationChangeSuccess', spy.flushTargetCache.bind(spy));
      }, 0);
    }
  };
});
