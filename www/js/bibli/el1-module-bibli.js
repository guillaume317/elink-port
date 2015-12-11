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
                liensNonLus : function($rootScope, LiensService) {
                  return LiensService.findNotReadLinksByUser($rootScope.userConnected.$id);
                },
                liensLus : function($rootScope, LiensService) {
                  return LiensService.findReadLinksByUser($rootScope.userConnected.$id);
                },
                allMyCercles :  function($rootScope, UsersManager) {
                  return UsersManager.findCerclesByUser($rootScope.userConnected.$id);
                },
                allCategories : function(LiensService) {
                  return LiensService.findCategories();
                }
              }
            },
            'fabContent': {
              template: '<button id="fab-nonLu" class="button button-fab button-fab-top-right expanded button-energized-900 drop"><i class="icon ion-plus-round"></i></button>',
              controller: function($timeout) {
                $timeout(function() {
                  document.getElementById('fab-nonLu').classList.toggle('on');
                }, 200);
              }
            }
          }
        });


      $stateProvider.state('app.bibli-lu', {
        url: '/bibli/lu',
        views: {
          'menuContent': {
            templateUrl: 'templates/el1-lu.tpl.html',
            controller: 'bibliController',
            resolve: {
              liensNonLus : function($rootScope, LiensService) {
                return LiensService.findNotReadLinksByUser($rootScope.userConnected.$id);
              },
              liensLus : function($rootScope, LiensService) {
                return LiensService.findReadLinksByUser($rootScope.userConnected.$id);
              },
              allMyCercles :  function($rootScope, UsersManager) {
                return UsersManager.findCerclesByUser($rootScope.userConnected.$id);
              },
              allCategories : function(LiensService) {
                return LiensService.findCategories();
              }
            }
          },
          'fabContent': {
            template: '<button id="fab-lu" class="button button-fab button-fab-top-right expanded button-energized-900 drop"><i class="icon ion-plus-round"></i></button>',
            controller: function($timeout) {
              $timeout(function() {
                document.getElementById('fab-lu').classList.toggle('on');
              }, 200);
            }
          }
        }
      });

    });

}(angular.module('el1.bibli', [ 'ionic', 'ionic-material', 'ionMdInput', 'el1.services.commun', 'el1.model' ] )));
