angular.module('el1.login', ['ionic', 'ionic-material', 'ionMdInput', 'el1.services.commun', 'el1.model'])
    .config(function ($stateProvider) {

        $stateProvider.state('showLogin', {
            url: '/showLogin',
            data:{ pageTitle: 'Login' },
            views: {
                "main": {
                    controller: 'LoginCtrl',
                    templateUrl: 'js/login/login.tpl.html'
                }
            },
            resolve: {

            }
        });


    })
    .controller('LoginCtrl', function($state, $rootScope, $scope, $http, $location, AuthService, Env, $log) {

            $scope.credentials = {};

            $scope.login = function () {
                AuthService.login($scope.credentials).then (function() {
                    $scope.authenticationError = false;
                    $rootScope.user= Env.getUser();
                    window.localStorage['user']=  Env.getUser();
                    $location.path("/home");
                }, function(erreur) {
                    $scope.authenticationError = true;
                });
            };

    });
