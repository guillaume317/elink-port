(function(module){

    'use strict';
    module.config(function ($stateProvider) {

        $stateProvider.state('app.cercle-view', {
          url: '/cercle/view',
          views: {
            'menuContent': {
              templateUrl: 'templates/el1-cercles.tpl.html',
              controller: 'cercleController',
              resolve: {
                liens : ['$log', 'LiensService', 'UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                  function($log, LiensService, UsersManager, SessionStorage, USERFIREBASEPROFILEKEY) {
                    return UsersManager.findCerclesByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid)
                      .then(function (cercles) {
                        if (cercles.length > 0) {
                          return LiensService.findLinksByCerlceName(cercles[0].$id);
                        } else {
                          return [];
                        }
                      })
                  }],
                allMyCercles :  ['UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                  function(UsersManager, SessionStorage, USERFIREBASEPROFILEKEY) {
                    return UsersManager.findCerclesByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
                  }],
                allCategories : ['LiensService', function(LiensService) {
                  return LiensService.findCategories();
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


        $stateProvider.state('app.icdc-view', {
          url: '/icdc/view',
          views: {
            'menuContent': {
              templateUrl: 'templates/el1-icdc.tpl.html',
              controller: 'icdcController',
              resolve: {
                allCategories : ['LiensService', function(LiensService) {
                  return LiensService.findCategories();
                }],
                topTen : ['LiensService', function(LiensService) {
                  return LiensService.findTopTenLinks();
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

}(angular.module('el1.cercle', [ 'ionic', 'ionic-material', 'ionMdInput', 'el1.services.commun', 'el1.model' ] )));
