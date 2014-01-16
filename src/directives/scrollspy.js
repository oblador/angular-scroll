angular.module('duScroll.scrollspy', ['duScroll.scrollPosition']).
directive('duScrollspy', function($rootScope, scrollPosition) {
  var spies = [];
  var currentlyActive;
  var isObserving = false;

  function gotScroll($event, scrollY) {
    var toBeActive;
    for(var spy, scroll, pos, i = 0; i < spies.length; i++) {
      spy = spies[i];

      if (!spy.target) {
        spy.target = document.getElementById(spy.targetId);
        if (!spy.target) continue;
      }

      pos = spy.target.getBoundingClientRect();
      if(pos.top + spy.offset < 20 && pos.top*-1 < pos.height) {
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

  function addSpy(targetId, $element, offset) {
    if(!isObserving) {
      $rootScope.$on('$duScrollChanged', gotScroll);
      isObserving = true;
    }
    spies.push({
      targetId: targetId,
      target:   null, 
      $element: $element, 
      element:  angular.element($element[0]),
      offset:   offset
    });
  }

  return {
    link: function ($scope, $element, $attr) {
      if (!$attr.href || $attr.href.indexOf('#') === -1) return;
      var targetId = $attr.href.replace(/.*(?=#[^\s]+$)/, '').substring(1);
      if(!targetId) return;
      addSpy(targetId, $element, -($attr.offset ? parseInt($attr.offset, 10) : 0));

      $scope.$on("$destroy", function() {
        currentlyActive = null;
        for (var i = 0; i < spies.length; i++) {
          if (spies[i].$element === $element) {
            spies.splice(i, 1);
            return;
          }
        }
      });
    }
  };
});