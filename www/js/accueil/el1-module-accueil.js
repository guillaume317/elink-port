(function(module){

    'use strict';
    module.config(function ($stateProvider) {

        $stateProvider.state('app.home2', {
          url: '/home2',
          views: {
            'menuContent': {
              templateUrl: 'templates/accueil.tpl.html',
              controller: 'accueilController',
              resolve: {
              }
            },
            'fabContent': {
              template: ''
            }
          }
        });


    });

}(angular.module('el1.truc', [ 'ionic', 'ionic-material', 'ionMdInput', 'el1.services.commun', 'el1.model' ] )));
