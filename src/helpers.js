angular.module('duScroll.scrollHelpers', []).
run(function($window, $q, cancelAnimation, requestAnimation, duScrollEasing) {
  var proto = angular.element.prototype;
  this.$get = function() {
    return proto;
  };
  
  var isDocument = function(el) {
    return (typeof HTMLDocument !== 'undefined' && el instanceof HTMLDocument) || (el.nodeType && el.nodeType === el.DOCUMENT_NODE);
  };

  var isElement = function(el) {
    return (typeof HTMLElement !== 'undefined' && el instanceof HTMLElement) || (el.nodeType && el.nodeType === el.ELEMENT_NODE);
  };

  var unwrap = function(el) {
    return isElement(el) || isDocument(el) ? el : el[0];
  };

  proto.scrollTo = function(left, top, duration, easing) {
    if(angular.isElement(left)) {
      return this.scrollToElement.apply(this, arguments);
    }
    if(duration) {
      return this.scrollToAnimated.apply(this, arguments);
    }
    var el = unwrap(this);
    if(isDocument(el)) {
      return $window.scrollTo(left, top);
    }
    el.scrollLeft = left;
    el.scrollTop = top;
  };

  var scrollAnimation, deferred;
  proto.scrollToAnimated = function(left, top, duration, easing) {
    if(duration && !easing) {
      easing = duScrollEasing;
    }
    var startLeft = this.scrollLeft(),
        startTop = this.scrollTop(),
        deltaLeft = Math.round(left - startLeft),
        deltaTop = Math.round(top - startTop);

    if(!deltaLeft && !deltaTop) return;

    var startTime = null;
    if(scrollAnimation) {
      cancelAnimation(scrollAnimation);
      deferred.reject();
    }
    var el = this;
    deferred = $q.defer();

    var animationStep = function(timestamp) {
      if (startTime === null) {
        startTime = timestamp;
      }

      var progress = timestamp - startTime;
      var percent = (progress >= duration ? 1 : easing(progress/duration));
      
      el.scrollTo(
        startLeft + Math.ceil(deltaLeft * percent),
        startTop + Math.ceil(deltaTop * percent)
      );
      if(percent < 1) {
        scrollAnimation = requestAnimation(animationStep);
      } else {
        scrollAnimation = null;
        deferred.resolve();
      }
    };

    scrollAnimation = requestAnimation(animationStep);
    return deferred.promise;
  };

  proto.scrollToElement = function(target, offset, duration, easing) {
    var el = unwrap(this);
    var top = this.scrollTop() + unwrap(target).getBoundingClientRect().top - offset;
    if(isElement(el)) {
      top -= el.getBoundingClientRect().top;
    }
    return this.scrollTo(0, top, duration, easing);
  };

  var overloaders = {
    scrollLeft: function(value, duration, easing) {
      if(angular.isNumber(value)) {
        return this.scrollTo(value, this.scrollTop(), duration, easing);
      }
      var el = unwrap(this);
      if(isDocument(el)) {
        return $window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft;
      }
      return el.scrollLeft;
    }, 
    scrollTop: function(value, duration, easing) {
      if(angular.isNumber(value)) {
        return this.scrollTo(this.scrollTop(), value, duration, easing);
      }
      var el = unwrap(this);
      if(isDocument(el)) {
        return $window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      }
      return el.scrollTop;
    }
  };

  //Add duration and easing functionality to existing jQuery getter/setters 
  var overloadScrollPos = function(superFn, overloadFn) {
    return function(value, duration, easing) {
      if(duration) {
        return overloadFn.apply(this, arguments);
      }
      return superFn.apply(this, arguments);
    };
  };

  for(var methodName in overloaders) {
    proto[methodName] = (proto[methodName] ? overloadScrollPos(proto[methodName], overloaders[methodName]) : overloaders[methodName]);
  }
});
