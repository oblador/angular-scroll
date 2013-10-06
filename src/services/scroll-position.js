angular.module('duScroll.scrollPosition', ['duScroll.requestAnimation']).
factory('scrollPosition',
  function($window, requestAnimation) {
    var listeners = [];
    var lastScrollY = 0;
    var currentScrollY = 0;
    
    var executeCallbacks = function(scrollY){
      currentScrollY = lastScrollY;
      for(var i = 0; i < listeners.length; i++){
        listeners[i](currentScrollY);
      }
    };

    angular.element($window).on('scroll', function(){
      lastScrollY = this.scrollY;

      if(lastScrollY !== currentScrollY){
        requestAnimation(executeCallbacks);
      }
    });

    return {
      listen : function(cb){
        listeners.push(cb);
      }
    };
});