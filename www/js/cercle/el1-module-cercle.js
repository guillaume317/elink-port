(function(module){

    'use strict';
    module.config(function ($stateProvider) {

        

        $stateProvider.state('cercle-view', {
            url: '/cercle/view',
            data : {
                    title :"view"
            },
            views: {
                "main": {
                    controller: 'cercleController',
                    templateUrl: 'src/app/cercle/views/el1-view.tpl.html',
                    resolve: {
                        allLiens : function($log, LiensService, $stateParams) {
                            // features/feature-01-oauth
                            /**var cercles= LiensService.findMyCercles();
                            return LiensService.findTeamLinks(cercles[0]);*/
                            return LiensService.findMyCercles().then(function(cercles) {
                                return LiensService.findTeamLinks(cercles[0]);
                            });
                        },
                        allCategories : function($log, LiensService, $stateParams) {
                            return LiensService.findCategories();
                        },
                        allMyCercles : function($log, LiensService, $stateParams) {
                            return LiensService.findMyCercles();
                        }
                    }
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('commons');
                    $translatePartialLoader.addPart('el1-view');
                    return $translate.refresh();
                }]
            }
        });


        

    });

}(angular.module('el1.cercle', [ 'ngMaterial', 'ui.router', 'el1.services.commun', 'el1.model' ] )));
