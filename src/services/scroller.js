angular.module('duScroll.scroller', ['duScroll.requestAnimation']).
factory('scroller',
  function($window, requestAnimation, scrollPosition, duScrollEasing) {

    function scrollTo(x, y, duration, container){
      if(!duration) {
        if(container){
          container.scrollLeft = x;
          container.scrollTop = y;
        } else {
          $window.scrollTo(x, y);
        }

        return;
      }
      var start = {
        y: scrollPosition.y(container),
        x: scrollPosition.x(container)
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
        var percent = (frame === frames ? 1 : duScrollEasing(frame/frames));
        if(container){
          container.scrollLeft = start.x + Math.ceil(delta.x * percent);
          container.scrollTop = start.y + Math.ceil(delta.y * percent);
        } else {
          $window.scrollTo( start.x + Math.ceil(delta.x * percent), start.y + Math.ceil(delta.y * percent));
        }
        if(frame<frames) { requestAnimation(animate); }
      };
      animate();
    }
    
    function scrollDelta(x, y, duration, container){
      scrollTo(scrollPosition.x(container) + (x || 0), scrollPosition.y(container) + (y || 0), duration, container);
    }

    function scrollToElement(element, offset, duration, container){
      if(!angular.isElement(element)) { return; }
      //Remove jQuery wrapper (if any)
      element = element[0] || element;
      if(!element.getBoundingClientRect) return;

      if(!offset || isNaN(offset)) {
        offset = 0;
      } else {
        offset = -offset;
      }

      var pos = element.getBoundingClientRect();

      if(container) {
        var containerPos = container.getBoundingClientRect();
        offset -= containerPos.top;
      }

      scrollDelta(0, pos.top + offset, duration, container);
    }

    return {
      scrollTo:         scrollTo,
      scrollToElement:  scrollToElement,
      scrollDelta:      scrollDelta
    };
  }
);
