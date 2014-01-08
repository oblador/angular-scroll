angular.module('duScroll.scroller', ['duScroll.requestAnimation']).
factory('scroller',
  function($window, requestAnimation, scrollPosition) {

    function easeout(x) {
      return Math.pow(x, 0.7);
    }

    function scrollTo(x, y, duration){
      if(!duration) {
        $window.scrollTo(x, y);
        return;
      }
      var start = {
        y: scrollPosition.y(),
        x: scrollPosition.x()
      };
      var delta = {
        y: Math.round(y - start.y),
        x: Math.round(x - start.x)
      };
      if(!delta.x && !delta.y) return;

      var frame = 0;
      var frames = Math.ceil(duration/60);
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
      scrollTo(scrollPosition.x() + (x || 0), scrollPosition.y() + (y || 0), duration);
    }

    function scrollToElement(element, offset, duration){
      if(!element || !element.getBoundingClientRect) return;

      var pos = element.getBoundingClientRect();

      scrollDelta(0, pos.top + (!offset || isNaN(offset) ? 0 : -offset), duration);
    }

    return {
      scrollTo:         scrollTo,
      scrollToElement:  scrollToElement,
      scrollDelta:      scrollDelta
    };
  }
);
