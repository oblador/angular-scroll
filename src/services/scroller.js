angular.module('duScroll.scroller', ['duScroll.requestAnimation']).
factory('scroller',
  function($window, requestAnimation) {

    function easeout(x) {
      return Math.pow(x, 0.7);
    }

    function scrollTo(x, y, duration){
      if(!duration) {
        $window.scrollTo(x, y);
        return;
      }
      var start = {
        y: $window.scrollY,
        x: $window.scrollX
      };
      var delta = {
        y: y - start.y,
        x: x - start.x
      };
      var frame = 0;
      var frames = duration/60;
      var animate = function() {
        frame++;
        var percent = (frame === frames ? 1 : easeout(frame/frames));
        $window.scrollTo(
          start.x + Math.ceil(delta.x * percent),
          start.y + Math.ceil(delta.y * percent)
        );
        if(frame<frames) {
          requestAnimation(animate);
        }
      };
      animate();
    }
    
    function scrollDelta(x, y, duration){
      scrollTo($window.scrollX + (x || 0), $window.scrollY + (y || 0), duration);
    }

    return {
      scrollTo:    scrollTo,
      scrollDelta: scrollDelta
    };
  }
);