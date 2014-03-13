angular.module('duScroll.smoothScroll', ['duScroll.scroller']).
directive('duSmoothScroll', ['scroller', 'duScrollDuration', function(scroller, duScrollDuration){

  return {
    link : function($scope, $element, $attr){
      var element = angular.element($element[0]);
      element.on('click', function(e){
        if(!$attr.href || $attr.href.indexOf('#') === -1) return;
        var elem = document.getElementById($attr.href.replace(/.*(?=#[^\s]+$)/, '').substring(1));
        if(!elem || !elem.getBoundingClientRect) return;

        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();

        var offset = -($attr.offset ? parseInt($attr.offset, 10) : 0);
        var duration = $attr.duration ? parseInt($attr.duration, 10) : duScrollDuration;
        var pos = elem.getBoundingClientRect();

        scroller.scrollDelta(0, pos.top + (isNaN(offset) ? 0 : offset), duration);
      });
    }
  };
}]);
