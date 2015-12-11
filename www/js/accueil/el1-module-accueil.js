angular.module('el1.accueil', [  'ionic', 'ionic-material', 'ionMdInput', 'el1.services.commun', 'el1.model' ])
    .config(function ($stateProvider) {

        $stateProvider.state('home', {
            url: '/home',
            data:{ pageTitle: 'Home' },
            views: {
                'menuContent': {
                  templateUrl: 'templates/accueil.tpl.html',
                  controller: 'toolbarController'
                },
                'fabContent': {
                  template: ''
                }
            },
            resolve: {
            }
        });


    });
