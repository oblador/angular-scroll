angular.module('duScroll.scrollPosition', ['duScroll.requestAnimation']).
factory('scrollPosition',
  function($document, $window, requestAnimation) {
    var observers = [];
    var lastScrollY = 0;
    var currentScrollY = 0;
    
    var executeCallbacks = function(){
      currentScrollY = lastScrollY;
      for(var i = 0; i < observers.length; i++){
        observers[i](currentScrollY);
      }
    };

    angular.element($document).on('scroll', function(){
      lastScrollY = $window.scrollY || document.documentElement.scrollTop;

      if(lastScrollY !== currentScrollY){
        requestAnimation(executeCallbacks);
      }
    });

    return {
      observe : function(cb){
        observers.push(cb);
      }
    };
});