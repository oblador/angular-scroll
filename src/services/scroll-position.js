angular.module('duScroll.scrollPosition', ['duScroll.requestAnimation']).
factory('scrollPosition', ['$document', '$window', '$rootScope', 'requestAnimation',
  function($document, $window, $rootScope, requestAnimation) {
    var observers = [];
    var lastScrollY = 0;
    var currentScrollY = 0;

    var executeCallbacks = function(){
      $rootScope.$emit('$duScrollChanged', currentScrollY);
      currentScrollY = lastScrollY;
      for(var i = 0; i < observers.length; i++){
        observers[i](currentScrollY);
      }
    };

    var getScrollY = function() {
      return $window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    };

    var getScrollX = function() {
      return $window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft;
    };

    angular.element($document).on('scroll', function(){
      lastScrollY = getScrollY();

      if(lastScrollY !== currentScrollY){
        requestAnimation(executeCallbacks);
      }
    });
    var deprecationWarned = false;
    return {
      observe : function(cb){
        if(!deprecationWarned && console && console.warn) {
          console.warn('scrollPosition.observe is deprecated, use $rootScope.$on(\'$duScrollChanged\') instead');
          deprecationWarned = true;
        }
        observers.push(cb);
      },
      x: getScrollX,
      y: getScrollY
    };
  }
]);
