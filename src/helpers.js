angular.module('duScroll.scrollHelpers', []).
run(function($window) {
  var proto = angular.element.prototype;
  this.$get = function() {
    return proto;
  };
  
  var unwrap = function(el) {
    return el instanceof HTMLElement || el instanceof HTMLDocument ? el : el[0];
  };

  proto.scrollTo = function(left, top) {
    if(angular.isElement(left)) {
      return this.scrollToElement(left, top);
    }
    var el = unwrap(this);
    if(el instanceof HTMLDocument) {
      return $window.scrollTo(left, top);
    }
    el.scrollLeft = left;
    el.scrollTop = top;
  };

  proto.scrollToElement = function(target) {
    var el = unwrap(this);
    var top = this.scrollTop() + unwrap(target).getBoundingClientRect().top;
    if(el instanceof HTMLElement) {
      top -= el.getBoundingClientRect().top;
    }
    this.scrollTo(0, top);
  };

  proto.scrollLeft = function(value) {
    if(angular.isNumber(value)) {
      return this.scrollTo(value, this.scrollTop());
    }
    var el = unwrap(this);
    if(el instanceof HTMLDocument) {
      return $window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft;
    }
    return el.scrollLeft;
  };

  proto.scrollTop = function(value) {
    if(angular.isNumber(value)) {
      return this.scrollTo(this.scrollTop(), value);
    }
    var el = unwrap(this);
    if(el instanceof HTMLDocument) {
      return $window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    }
    return el.scrollTop;
  };

});
