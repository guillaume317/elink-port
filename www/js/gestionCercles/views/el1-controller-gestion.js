(function(){

    angular
        .module('el1.gestion')
        .controller('gestionController', [
            '$log', '$scope', '$state',
            'AlertService', '$translate',
            'GestionService',
            'CercleModel',
            'mesInvitations', 'personnes', 'cercles',
            '$mdDialog', '$mdMedia',
            GestionController
        ])
        .controller('nouveauCercleController', [
            '$log', '$scope', '$state',
            'AlertService', '$translate',
            'GestionService',
            'CercleModel',
            '$mdDialog', '$mdMedia',
            NouveauCercleController
        ]);

    /**
     */
    function GestionController($log, $scope, $state, AlertService, $translate, GestionService, CercleModel, mesInvitations, personnes, cercles, $mdDialog, $mdMedia ) {
        $scope.mesInvitations= mesInvitations;
        $scope.personnes= personnes;
        $scope.cercles= cercles;
        if (cercles[0])
            $scope.cercle= cercles[0];

        $scope.nouveauCercle = function(ev) {

            $mdDialog.show({
                controller: NouveauCercleController,
                templateUrl: 'src/app/gestionCercles/views/el1-nouveauCercle.tpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                },
                clickOutsideToClose:true,
                fullscreen: $mdMedia('sm') && $scope.customFullscreen
            })
                .then(function(shareLink) {
                    // valider
                }, function() {
                    // cancel
                });

            $scope.$watch(function() {
                return $mdMedia('sm');
            }, function(sm) {
                $scope.customFullscreen = (sm === true);
            });

        };


        $scope.changeCercle= function(cercle) {
            GestionService.findPersonnesByCercle(cercle).then(
                function (status) {
                    $log.debug("findPersonnesByCercle return : " + status);
                    if (status == 201) {
                        AlertService.success($translate.instant('gestion.message.inviter'));

                    }
                }, function (error) {
                    //
                    $log.error(error);
                }
            );

        }

        $scope.inviter= function(invite) {
            GestionService.inviter(invite).then(
                function (status) {
                    $log.debug("inviter return : " + status);
                    if (status == 201)
                        AlertService.success($translate.instant('gestion.message.inviter'));
                }, function (error) {
                    //
                    $log.error(error);
                }
            );
        }

        $scope.accepterInvitation= function(invitation) {
            GestionService.accepterInvitation(invitation).then(
                function (status) {
                    $log.debug("accepterInvitation  return : " + status);
                    if (status == 201)
                        AlertService.success($translate.instant('gestion.message.accepterInvitation'));
                }, function (error) {
                    //
                    $log.error(error);
                }
            );
        }

    }

    /**
     */
    function NouveauCercleController($log, $scope, $state, AlertService, $translate, GestionService, CercleModel, $mdDialog, $mdMedia) {
        $scope.currentCercle= new CercleModel();
        $scope.alerts = [];

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.validate= function(currentCercle) {
            if ($scope.currentForm.$valid) {
                GestionService.createCercle(currentCercle).then(
                    function (status) {
                        $log.debug("validate return : " + status);
                        if (status == 201 )
                            AlertService.success($translate.instant('message.update'));
                        // $state.go();

                        $mdDialog.hide(shareLink);
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
