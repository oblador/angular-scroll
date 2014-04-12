angular.module('duScroll.spyContext', ['duScroll.spyAPI']).
directive('duSpyContext', function(spyAPI) {
  return {
    restrict: 'A',
    scope: true,
    compile: function compile(tElement, tAttrs, transclude) {
      return {
        pre: function preLink($scope, iElement, iAttrs, controller) {
          spyAPI.createContext($scope);
        }
      };
    }
  };
});
