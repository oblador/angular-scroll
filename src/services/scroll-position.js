angular.module('duScroll.scrollPosition', ['duScroll.requestAnimation']).
factory('scrollPosition',
  function($window, requestAnimation) {
    var observers = [];
    var lastScrollY = 0;
    var currentScrollY = 0;
    
    var executeCallbacks = function(scrollY){
      currentScrollY = lastScrollY;
      for(var i = 0; i < observers.length; i++){
        observers[i](currentScrollY);
      }
    };

    angular.element($window).on('scroll', function(){
      lastScrollY = this.scrollY;

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