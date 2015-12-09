(function(){

    angular
        .module('el1.bibli')
        .controller('bibliController', [
            '$log', '$scope', '$state',
            'LienModel',
            'LiensService',
            'allLiens', 'allCategories', 'allMyCercles',
            '$mdDialog', '$mdMedia',
            BibliController
            ])
        .controller('shareController', [
            '$log', '$scope', '$state',
            'LienModel',
            'LiensService',
            '$mdDialog', '$mdMedia',
            ShareController
        ]);

    /**
     */
    function BibliController($log, $scope, $state, LienModel, LiensService, allLiens, allCategories, allMyCercles, $mdDialog, $mdMedia ) {
        $scope.customFullscreen = $mdMedia('sm');
        $scope.allLiens= allLiens;
        $scope.canShare= function() {
            return allMyCercles && allMyCercles[0];
        };

        $scope.delete= function(aLienModel) {
            LiensService.deleteLien(aLienModel).then(
                function (status) {
                    if (status == 201) {
                        // TODO supprimer element du tableau $scope.allLiens.
                    }
                }, function (error) {
                    //
                    $log.error(error);
                }
            );
        };

        $scope.unread= function(aLienModel) {
            LiensService.markAsUnread(aLienModel).then(
                function (status) {
                    if (status == 201){
                        // TODO modif du lien en local
                    }
                }, function (error) {
                    //
                    $log.error(error);
                }
            );
        };

        $scope.read= function(aLienModel) {
            LiensService.markAsRead(aLienModel).then(
                function (status) {
                    if (status == 201) {
                        // TODO modif du lien en local
                    }
                }, function (error) {
                    //
                    $log.error(error);
                }
            );
        };

        $scope.share= function(ev, aLienModel) {
            $scope.categories= [];
            //$scope.categories=LiensService.findCategories();
            // features/feature-01-oauth
            LiensService.findCategories().then(function(categories) {
                $scope.categories=categories;
            });

            $mdDialog.show({
                controller: ShareController,
                templateUrl: 'src/app/bibli/views/el1-share.tpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    link: aLienModel,
                    allCategories: allCategories,
                    allMyCercles: allMyCercles
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

    }

    /**
     */
    function ShareController($log, $scope, $state, LienModel, LiensService, link, allCategories, allMyCercles, $mdDialog, $mdMedia ) {
        $scope.link= link;
        $scope.shareLink= new LienModel();
        $scope.shareLink.cercle= allMyCercles[0];
        $scope.shareLink.category= allCategories[0];

        $scope.categories= allCategories;
        $scope.cercles= allMyCercles;

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.validate = function(shareLink) {
            if ($scope.currentForm.$valid) {
                shareLink.url = link.url;

                LiensService.shareLien(shareLink).then(
                    function (status) {
                        $log.debug("share " + shareLink.title + " return : " + status);
                        if (status == 201)
                            AlertService.success($translate.instant('view.message.shareLink'));
                        // $state.go();

                        $mdDialog.hide(shareLink);
                    }, function (error) {
                        //
                        $log.error(error);
                    }
                );

            }
        };
    }

})();