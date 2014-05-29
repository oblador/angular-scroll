angular.module('duScroll.scrollContainer', ['duScroll.scrollContainerAPI', 'duScroll.spyAPI']).
directive('duScrollContainer', function(scrollContainerAPI, spyAPI){
  return {
    restrict: 'A',
    scope: true,
    compile: function compile(tElement, tAttrs, transclude) {
      return {
        pre: function preLink($scope, iElement, iAttrs, controller) {
          iAttrs.$observe('duScrollContainer', function(element) {
            if(angular.isString(element)) {
              var elementId = element;
              element = document.getElementById(elementId);

              //Rebind scroll watchers on location change
              var rebindContainer = function() {
                var newElement = document.getElementById(elementId);
                if($scope.$$destroyed || $scope.$parent.$$destroyed || !newElement) {
                  return;
                }
                element = angular.element(newElement);
                scrollContainerAPI.setContainer($scope, element);
                spyAPI.rebindContainer($scope, element);
              };
              $scope.$on('$locationChangeSuccess', rebindContainer);
            }

            element = (angular.isElement(element) ? angular.element(element) : iElement);
            scrollContainerAPI.setContainer($scope, element);
            $scope.$on('$destroy', function() {
              scrollContainerAPI.removeContainer($scope);
            });
          });
        }
      };
    }
  };
});
