angular.module('duScroll.scrollContainer', ['duScroll.scrollContainerAPI']).
directive('duScrollContainer', function(duScrollContainerAPI){
  return {
    restrict: 'A',
    scope: true,
    compile: function compile(tElement, tAttrs, transclude) {
      return {
        pre: function preLink($scope, iElement, iAttrs, controller) {
          iAttrs.$observe('duScrollContainer', function(element) {
            if(angular.isString(element)) {
              element = document.getElementById(element);
            }
            element = (angular.isElement(element) ? angular.element(element) : iElement);
            duScrollContainerAPI.setContainer($scope, element);
            $scope.$on('$destroy', function() {
              duScrollContainerAPI.removeContainer($scope);
            });
          });
        }
      };
    }
  };
});
