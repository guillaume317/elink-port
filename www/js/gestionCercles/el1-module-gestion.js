(function(module){

    'use strict';
    module.config(function ($stateProvider) {

        

        $stateProvider.state('gestion-view', {
            url: '/gestion/view',
            data : {
                title :"gestion"
            },
            views: {
                "main": {
                    controller: 'gestionController',
                    templateUrl: 'src/app/gestionCercles/views/el1-gestion.tpl.html',
                    resolve: {
                        personnes : function($log, GestionService, LiensService, $stateParams) {
                            var cercles= LiensService.findMyCercles();
                            return GestionService.findPersonnesByCercle(cercles[0]);
                          //  return [];
                        },
                        mesInvitations : function($log, GestionService, Env, $stateParams) {
                            return GestionService.findInvitationsByUser(Env.getUser());
                            //return [];
                        },
                        cercles : function($log, LiensService, $stateParams) {
                            return LiensService.findMyCercles();
                        },
                    }
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('commons');
                    $translatePartialLoader.addPart('el1-gestion');
                    return $translate.refresh();
                }]
            }
        });

        

    });

}(angular.module('el1.gestion', [ 'ngMaterial', 'ui.router', 'el1.services.commun', 'el1.model' ] )));
