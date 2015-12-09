(function(module){

    'use strict';
    module.config(function ($stateProvider) {

        $stateProvider.state('nouveauLien-view', {
            url: '/nouveauLien/view',
            data : {
                title :"view"
            },
            views: {
                "main": {
                    controller: 'nouveauLienController',
                    templateUrl: 'src/app/nouveauLien/views/el1-view.tpl.html',
                    resolve: {
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

}(angular.module('el1.nouveauLien', [ 'ngMaterial', 'ui.router', 'el1.services.commun', 'el1.model' ] )));
