(function(){

    angular
        .module('el1.cercle')
        .controller('cercleController', [
            '$log', '$scope', '$state',
            'LiensService',
            'allLiens',
            'allCategories',
            'allMyCercles',
            '$stateParams', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion',
            CercleController
            ])
    ;

    /**
     */
    function CercleController($log, $scope, $state, LiensService, allLiens, allCategories, allMyCercles, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion ) {
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
        $scope.$parent.setHeaderFab('right');

        $timeout(function() {
          ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
          });
        }, 200);

        // Activate ink for controller
        ionicMaterialInk.displayEffect();

        $scope.allLiens= allLiens;
        $scope.categories= allCategories;
        $scope.cercles= allMyCercles;
        $scope.cercle= allMyCercles[0];
        $scope.filter= { "category" : "" };

        $scope.changeCercle= function() {

        }

        $scope.read= function(aLienModel) {
            LiensService.markAsRead(aLienModel);
        };

        $scope.showURL= function(lien) {
          window.open(lien.url, '_system', 'location=yes');
        };

    }

})();
