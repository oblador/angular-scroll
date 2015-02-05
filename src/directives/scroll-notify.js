angular.module('duScroll.scrollNotify', ['duScroll.notifyAPI'])
.directive('duScrollNotify', function(notifyAPI){
  'use strict';

  return {
    restrict: 'A',
    link : function ($scope, $element, $attr){

      notifyAPI.addNotifier($element);

      $scope.$on('$destroy', function() {
        notifyAPI.removeNotifier($element);
      });

    }
  };
});
