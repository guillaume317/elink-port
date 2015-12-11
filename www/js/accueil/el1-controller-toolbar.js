(function(){

    angular
        .module('el1.accueil')
        .controller('toolbarController', [
            '$log', '$scope', '$state', 'Env',
            'AlertService', '$translate',
            'LiensService',
            'LienModel',
            '$mdDialog', '$mdMedia',
            ToolbarController
        ]).controller('nouveauLienController', [
            '$log', '$scope', '$rootScope', '$state',
            'AlertService', '$translate',
            'LienModel',
            'LiensService',
            '$mdDialog', '$mdMedia',
            NouveauLienController
        ]);

    /**
     */
    function ToolbarController($log, $scope, $state, Env, AlertService, $translate, LiensService, LienModel,  $mdDialog, $mdMedia ) {
        $scope.selectedIndex = 0;
        $scope.isAdmin= Env.isAdmin;
        $scope.$watch('selectedIndex', function(current, old) {
            switch (current) {
                case 0:
                    $state.go('bibli-nonLu');
                    break;
                case 1:
                    $state.go('bibli-lu');
                    break;
                case 2:
                    $state.go("cercle-view");
                    break;
            }
        });

        $scope.admin = function() {
            $state.go('gestion-view');
        };

        $scope.nouveauLien = function(ev) {

            // passage en pop up

            $mdDialog.show({
                controller: NouveauLienController,
                templateUrl: 'src/app/accueil/views/el1-nouveauLien.tpl.html',
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

        $scope.logout = function() {
            AuthService.logout().then (function() {
                $scope.authenticationError = false;
                $rootScope.user= undefined;
                localStorageService.set('user', undefined);
                $location.path("/");
            }, function(erreur) {
                console.log(erreur);
                $scope.authenticationError = true;
            });
        };
    }

    /**
     */
    function NouveauLienController($log, $scope, $rootScope, $state, AlertService, $translate, LienModel, LiensService, $mdDialog, $mdMedia ) {
        $scope.currentLien= {"url" : "", private: true};
        $scope.alerts = [];

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.validate= function(currentLien) {
            if ($scope.currentForm.$valid) {
				LiensService.createLinkForUser(currentLien, $rootScope.userConnected.$id)
                    .then(function (newLink) {
                        	$mdDialog.hide(newLink);
                    }, function (error) {
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
