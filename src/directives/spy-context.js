angular.module('duScroll.spyContext', ['duScroll.spyAPI']).
directive('duSpyContext', function(duSpyAPI) {
  return {
    restrict: 'A',
    scope: true,
    compile: function compile(tElement, tAttrs, transclude) {
      return {
        pre: function preLink($scope, iElement, iAttrs, controller) {
          duSpyAPI.createContext($scope);
        }
      };
    }
  };
});
