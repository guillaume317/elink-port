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
                  allLiens : function($rootScope, $log, LiensService, UsersManager, $stateParams) {
                    /*
                    return LiensService.findMyCercles().then(function(cercles) {
                      return LiensService.findTeamLinks(cercles[0]);
                    });*/

                    // temp
                    return LiensService.findNotReadLinksByUser($rootScope.userConnected.$id);
                  },
                  allCategories : function($log, LiensService, $stateParams) {
                    return LiensService.findCategories();
                  },
                  allMyCercles : function($log, LiensService, $stateParams) {
                    return LiensService.findMyCercles();
                  }
              }
            },
            'fabContent': {
              template: '<button id="fab-cercle" class="button button-fab button-fab-top-right expanded button-energized-900 drop"><i class="icon ion-plus-round"></i></button>',
              controller: function($timeout) {
                $timeout(function() {
                  document.getElementById('fab-cercle').classList.toggle('on');
                }, 200);
              }

            }
          }
        });


    });

}(angular.module('el1.cercle', [ 'ionic', 'ionic-material', 'ionMdInput', 'el1.services.commun', 'el1.model' ] )));
