(function(){

    angular
        .module('el1.nouveauLien')
        .controller('nouveauLienController', [
            '$log', '$scope', '$state',
            'AlertService', '$translate',
            'LiensService',
            'LienModel',
            NouveauLienController
        ]);

    /**
     */
    function NouveauLienController($log, $scope, $state, AlertService, $translate, LiensService, LienModel ) {
        $scope.currentLien= new LienModel();
        $scope.alerts = [];

        $scope.validate= function() {
            if ($scope.currentForm.$valid) {
                LiensService.createLien($scope.currentLien).then(
                    function (status) {
                        $log.debug("validate return : " + status);
                        if (status == 201 )
                            AlertService.success($translate.instant('message.update'));
                        // $state.go();
                    }, function (error) {
                        //
                        $log.error(error);
                    }
                );
            }
        }

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

    }

})();
