/**
  * x is a value between 0 and 1, indicating where in the animation you are.
  */
var duScrollDefaultEasing = function (x) {
  if(x < 0.5) {
    return Math.pow(x*2, 2)/2;
  }
  return 1-Math.pow((1-x)*2, 2)/2;
};

angular.module('duScroll', ['duScroll.scroller', 'duScroll.scrollPosition', 'duScroll.scrollspy', 'duScroll.requestAnimation', 'duScroll.smoothScroll', 'duScroll.scrollContainer']).value('duScrollDuration', 1000).value('duScrollEasing', duScrollDefaultEasing);
