(function(){

    angular
        .module('el1.cercle')
        .controller('cercleController', [
            '$log', '$scope', '$state',
            'LiensService',
            'allLiens',
            'allCategories',
            'allMyCercles',
            CercleController
            ])
    ;

    /**
     */
    function CercleController($log, $scope, $state, LiensService, allLiens, allCategories, allMyCercles ) {
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

    }

})();