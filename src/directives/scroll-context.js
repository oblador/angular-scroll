angular.module('duScroll.scrollContext', ['duScroll.scrollContextAPI']).
directive('duScrollContext', function(duScrollContextAPI){
  return {
    restrict: 'A',
    scope: true,
    compile: function compile(tElement, tAttrs, transclude) {
      return {
        pre: function preLink($scope, iElement, iAttrs, controller) {
          iAttrs.$observe('duScrollContext', function(element) {
            if(angular.isString(element)) {
              element = document.getElementById(element);
            }
            if(!angular.isElement(element)) {
              element = iElement[0];
            }
            duScrollContextAPI.setContext($scope, element);
          });
        }
      };
    }
  };
});
