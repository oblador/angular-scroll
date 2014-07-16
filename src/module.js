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

angular.module('duScroll', [
  'duScroll.scrollspy', 
  'duScroll.smoothScroll', 
  'duScroll.scrollContainer', 
  'duScroll.spyContext',
  'duScroll.scrollHelpers'
]).value('duScrollDuration', 350)
  .value('duScrollSpyWait', 100)
  .value('duScrollGreedy', false)
  .value('duScrollEasing', duScrollDefaultEasing);
