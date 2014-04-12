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
    var el = unwrap(this);
    if(el instanceof HTMLDocument) {
      return $window.scrollTo(left, top);
    }
    el.scrollLeft = left;
    el.scrollTop = top;
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
