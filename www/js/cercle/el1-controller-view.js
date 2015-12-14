(function(){

    angular
        .module('el1.cercle')
        .controller('cercleController', [
            '$log', '$scope', '$state',
            'LiensService',
            'liens',
            'allCategories',
            'allMyCercles',
            '$stateParams', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion',
            CercleController
            ])
    ;

    /**
     */
    function CercleController($log, $scope, $state, LiensService, liens, allCategories, allMyCercles, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion ) {
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

        $scope.allLiens= liens;
        $scope.categories= allCategories;
        $scope.cercles= allMyCercles;
        $scope.cercle= allMyCercles[0];
        $scope.filter= { "category" : "" };

        $scope.changeCercle= function(cercle) {
          LiensService.findLinksByCerlceName(cercle.$id)
            .then(function(links){
              $scope.allLiens = links;
            });

        };

        $scope.moveToBiblio= function(lien) {
          //On déplace le lien dans biblio
          //puis on le supprime dans la liste des articles du cercle
          lien.private = "biblio";
          LiensService.createLinkForUser(lien, SessionStorage.get(USERFIREBASEPROFILEKEY).uid)
            .then(function() {
              $scope.allLiens.$remove(lien);
            })
        };

        $scope.showURL= function(lien) {
          window.open(lien.url, '_system', 'location=yes');
        };

    }

})();
