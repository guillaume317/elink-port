(function(module){

    'use strict';
    module.config(function ($stateProvider) {



        $stateProvider.state('app.gestion-view', {
            url: '/gestion/view',
            views: {
              'menuContent': {
                templateUrl: 'templates/el1-gestion.tpl.html',
                controller: 'gestionController',
                resolve: {
                    personnesDuCercle : ['GestionService', 'UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                      function(GestionService, UsersManager, SessionStorage, USERFIREBASEPROFILEKEY) {
                        //Recherches des cercles sont je suis membre
                        //Pour le premier d'entre eux, je recherche les personnes de ce cercle.
                        return UsersManager.findCerclesByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid)
                          .then (function(cerclesIndex) {
                          if (cerclesIndex && cerclesIndex.length > 0) {
                            return GestionService.findPersonnesByCercle(cerclesIndex[0]);
                          } else {
                            return [];
                          }
                        });
                      }],
                    mesInvitations : ['UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                      function(UsersManager, SessionStorage, USERFIREBASEPROFILEKEY) {
                        //Recherche des cercles sont je ne suis pas encore membre
                        return UsersManager.findInvitationsByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
                      }],
                    mesCercles : ['UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                      function(UsersManager, SessionStorage, USERFIREBASEPROFILEKEY) {
                        //Recherche des cercles dont je suis membre
                        return UsersManager.findCerclesByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
                      }],
                    usersEmail : ['UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                      function(UsersManager, SessionStorage, USERFIREBASEPROFILEKEY){
                        return UsersManager.getUsersEmail(SessionStorage.get(USERFIREBASEPROFILEKEY).uid)
                          .then(function(users) {
                            return users;
                          })
                      }]
                }
              },
              'fabContent': {
                template: ''
              }
            },
            resolve: {
                currentAuth: ['FBFactory', function(FBFactory) {
                    return FBFactory.auth().$requireAuth();
                }]
            }
        });



    });

}(angular.module('el1.gestion', [ 'ionic', 'ionic-material', 'ionMdInput', 'el1.services.commun', 'el1.model'  ] )));
