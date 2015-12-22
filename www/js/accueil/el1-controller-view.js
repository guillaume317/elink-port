(function(){

    angular
        .module('el1.truc')
        .controller('accueilController', [
            '$log', '$scope', '$rootScope', '$state',
            '$stateParams', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion',
        AccueilController
            ]);


    /**
     */
    function AccueilController($log, $scope, $rootScope, $state, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion ) {
      $log.info("AccueilController")

      $scope.$parent.showHeader();
      $scope.$parent.clearFabs();
      $scope.isExpanded = true;
      $scope.$parent.setExpanded(true);
      $scope.$parent.setHeaderFab('left');

      $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
          selector: '.animate-fade-slide-in .item'
        });
      }, 200);

      // Activate ink for controller
      ionicMaterialInk.displayEffect();


    }

})();
