angular.module('duScroll.scrollspy', ['duScroll.spyAPI']).
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
