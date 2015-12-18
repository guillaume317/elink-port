(function(module){

    'use strict';
    module.config(function ($stateProvider) {

        $stateProvider.state('app.bibli-nonLu', {
          url: '/bibli/nonLu',
          views: {
            'menuContent': {
              templateUrl: 'templates/el1-nonLu.tpl.html',
              controller: 'bibliController',
              resolve: {
                liensNonLus : ['$rootScope', 'LiensService', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                  function($rootScope, LiensService,  SessionStorage ,USERFIREBASEPROFILEKEY) {
                    return LiensService.findNotReadLinksByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
                  }],
                liensLus : ['$rootScope', 'LiensService', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                  function($rootScope, LiensService, SessionStorage ,USERFIREBASEPROFILEKEY) {
                    return LiensService.findReadLinksByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
                  }],
                allMyCercles :  ['$rootScope', 'UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                  function($rootScope, UsersManager, SessionStorage ,USERFIREBASEPROFILEKEY) {
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


      $stateProvider.state('app.bibli-lu', {
        url: '/bibli/lu',
        views: {
          'menuContent': {
            templateUrl: 'templates/el1-lu.tpl.html',
            controller: 'bibliController',
            resolve: {
              liensNonLus : ['$rootScope', 'LiensService', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                function($rootScope, LiensService,  SessionStorage ,USERFIREBASEPROFILEKEY) {
                  return LiensService.findNotReadLinksByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
                }],
              liensLus : ['$rootScope', 'LiensService', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                function($rootScope, LiensService,SessionStorage ,USERFIREBASEPROFILEKEY) {
                  return LiensService.findReadLinksByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
                }],
              allMyCercles :  ['$rootScope', 'UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                function($rootScope, UsersManager, SessionStorage ,USERFIREBASEPROFILEKEY) {
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

    });

}(angular.module('el1.bibli', [ 'ionic', 'ionic-material', 'ionMdInput', 'el1.services.commun', 'el1.model' ] )));
