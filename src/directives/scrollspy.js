angular.module('duScroll.scrollspy', ['duScroll.scrollPosition']).
directive('duScrollspy', function(scrollPosition) {
  var spies = [];
  var currentlyActive;

  function gotScroll(scrollY) {
    var toBeActive;
    for(var spy, scroll, pos, i = 0; i < spies.length; i++) {
      spy = spies[i];
      pos = spy.target.getBoundingClientRect();
      if(pos.top + spy.offset < 0 && pos.top*-1 < pos.height) {
        if(!toBeActive || toBeActive.top < pos.top) {
          toBeActive = {
            top: pos.top,
            spy: spy
          };
        }
      }
    }
    if(toBeActive) {
      toBeActive = toBeActive.spy;
    }
    if(currentlyActive === toBeActive) return;
    if(currentlyActive) currentlyActive.$element.removeClass('active');
    if(toBeActive) toBeActive.$element.addClass('active');
    currentlyActive = toBeActive;
  }

  function addSpy(target, $element, offset) {
    if(!spies.length) {
      scrollPosition.observe(gotScroll);
    }
    spies.push({
      target:   target, 
      $element: $element, 
      element:  angular.element($element[0]),
      offset:   offset
    });
  }

  return {
    link: function ($scope, $element, $attr) {
      if(!$attr.href || $attr.href.indexOf('#') === -1) return;
      var target = document.getElementById($attr.href.replace(/.*(?=#[^\s]+$)/, '').substring(1));
      if(!target) return;
      addSpy(target, $element, -($attr.offset ? parseInt($attr.offset, 10) : 0));
    }
  };
});