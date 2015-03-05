/**
  * x is a value between 0 and 1, indicating where in the animation you are.
  */
var duScrollDefaultEasing = function (x) {
  'use strict';

  if(x < 0.5) {
    return Math.pow(x*2, 2)/2;
  }
  return 1-Math.pow((1-x)*2, 2)/2;
};

var duScroll = angular.module('duScroll', [
  'duScroll.scrollspy',
  'duScroll.smoothScroll',
  'duScroll.scrollContainer',
  'duScroll.spyContext',
  'duScroll.scrollHelpers'
])
  //Default animation duration for smoothScroll directive
  .value('duScrollDuration', 350)
  //Scrollspy debounce interval, set to 0 to disable
  .value('duScrollSpyWait', 100)
  //Scrollspy forced refresh interval, use if your content changes or reflows without scrolling.
  //0 to disable
  .value('duScrollSpyRefreshInterval', 0)
  //Wether or not multiple scrollspies can be active at once
  .value('duScrollGreedy', false)
  //Default offset for smoothScroll directive
  .value('duScrollOffset', 0)
  //Default easing function for scroll animation
  .value('duScrollEasing', duScrollDefaultEasing)
  //Which events on the container (such as body) should cancel scroll animations
  .value('duScrollCancelOnEvents', 'scroll mousedown mousewheel touchmove keydown')
  //Whether or not to activate the last scrollspy, when page/container bottom is reached
  .value('duScrollBottomSpy', false)
  //Active class name
  .value('duScrollActiveClass', 'active');

if (typeof module !== 'undefined' && module && module.exports) {
  module.exports = duScroll;
}
