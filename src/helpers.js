angular.module('duScroll.scrollHelpers', []).
run(function($window, requestAnimation, duScrollEasing) {
  var proto = angular.element.prototype;
  this.$get = function() {
    return proto;
  };
  
  var unwrap = function(el) {
    return el instanceof HTMLElement || el instanceof HTMLDocument ? el : el[0];
  };

  proto.scrollTo = function(left, top, duration, easing) {
    if(angular.isElement(left)) {
      return this.scrollToElement(left, 0, top, duration);
    }
    if(duration) {
      return this.scrollToAnimated.apply(this, arguments);
    }
    var el = unwrap(this);
    if(el instanceof HTMLDocument) {
      return $window.scrollTo(left, top);
    }
    el.scrollLeft = left;
    el.scrollTop = top;
  };

  proto.scrollToAnimated = function(left, top, duration, easing) {
    if(duration && !easing) {
      easing = duScrollEasing;
    }
    var startLeft = this.scrollLeft(),
        startTop = this.scrollTop(),
        deltaLeft = Math.round(left - startLeft),
        deltaTop = Math.round(top - startTop);

    if(!deltaLeft && !deltaTop) return;

    var frame = 0, frames = Math.ceil(duration/60);

    var animate = function() {
      frame++;
      var percent = (frame === frames ? 1 : easing(frame/frames));
      this.scrollTo(
        startLeft + Math.ceil(deltaLeft * percent),
        startTop + Math.ceil(deltaTop * percent)
      );
      if(frame<frames) { requestAnimation(animate); }
    }.bind(this);
    animate();
  };

  proto.scrollToElement = function(target, offset, duration, easing) {
    var el = unwrap(this);
    var top = this.scrollTop() + unwrap(target).getBoundingClientRect().top - offset;
    if(el instanceof HTMLElement) {
      top -= el.getBoundingClientRect().top;
    }
    this.scrollTo(0, top, duration, easing);
  };

  proto.scrollLeft = function(value, duration, easing) {
    if(angular.isNumber(value)) {
      return this.scrollTo(value, this.scrollTop(), duration, easing);
    }
    var el = unwrap(this);
    if(el instanceof HTMLDocument) {
      return $window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft;
    }
    return el.scrollLeft;
  };

  proto.scrollTop = function(value, duration, easing) {
    if(angular.isNumber(value)) {
      return this.scrollTo(this.scrollTop(), value, duration, easing);
    }
    var el = unwrap(this);
    if(el instanceof HTMLDocument) {
      return $window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    }
    return el.scrollTop;
  };

});
