(function(module){

    'use strict';
    module.config(function ($stateProvider) {

        $stateProvider.state('bibli-nonLu', {
            url: '/bibli/nonLu',
            data : {
                title :"view"
            },
            views: {
                "main": {
                    controller: 'bibliController',
                    templateUrl: 'js/bibli/views/el1-nonLu.tpl.html',
                    resolve: {
                        allLiens : function($log, LiensService, $stateParams) {
                            return LiensService.findMyLinks(true);
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

            }
        });

        $stateProvider.state('bibli-lu', {
            url: '/bibli/lu',
            data : {
                    title :"view"
            },
            views: {
                "main": {
                    controller: 'bibliController',
                    templateUrl: 'js//bibli/views/el1-lu.tpl.html',
                    resolve: {
                        allLiens : function($log, LiensService, $stateParams) {
                            return LiensService.findMyLinks(false);
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

            }
        });




    });

}(angular.module('el1.bibli', [ 'ionic', 'ionic-material', 'ionMdInput', 'el1.services.commun', 'el1.model' ] )));
