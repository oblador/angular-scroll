angular.module('duScroll.scrollHelpers', ['duScroll.requestAnimation'])
.run(function($window, $q, cancelAnimation, requestAnimation, duScrollEasing) {
  'use strict';

  var proto = angular.element.prototype;

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
    var aliasFn;
    if(angular.isElement(left)) {
      aliasFn = this.scrollToElement;
    } else if(duration) {
      aliasFn = this.scrollToAnimated;
    }
    if(aliasFn) {
      return aliasFn.apply(this, arguments);
    }
    var el = unwrap(this);
    if(isDocument(el)) {
      return $window.scrollTo(left, top);
    }
    el.scrollLeft = left;
    el.scrollTop = top;
  };

  proto.scrollToAnimated = function(left, top, duration, easing) {
    var scrollAnimation, deferred;
    if(duration && !easing) {
      easing = duScrollEasing;
    }
    var startLeft = this.scrollLeft(),
        startTop = this.scrollTop(),
        deltaLeft = Math.round(left - startLeft),
        deltaTop = Math.round(top - startTop);

    var startTime = null;
    var el = this;

    var cancelOnEvents = 'scroll mousedown mousewheel touchmove keydown';
    var cancelScrollAnimation = function($event) {
      if (!$event || $event.which > 0) {
        el.unbind(cancelOnEvents, cancelScrollAnimation);
        cancelAnimation(scrollAnimation);
        deferred.reject();
        scrollAnimation = null;
      }
    };

    if(scrollAnimation) {
      cancelScrollAnimation();
    }
    deferred = $q.defer();

    if(!deltaLeft && !deltaTop) {
      deferred.resolve();
      return deferred.promise;
    }

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
        el.unbind(cancelOnEvents, cancelScrollAnimation);
        scrollAnimation = null;
        deferred.resolve();
      }
    };

    //Fix random mobile safari bug when scrolling to top by hitting status bar
    el.scrollTo(startLeft, startTop);

    el.bind(cancelOnEvents, cancelScrollAnimation);

    scrollAnimation = requestAnimation(animationStep);
    return deferred.promise;
  };

  proto.scrollToElement = function(target, offset, duration, easing) {
    var el = unwrap(this);
    var top = this.scrollTop() + unwrap(target).getBoundingClientRect().top - (offset || 0);
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
