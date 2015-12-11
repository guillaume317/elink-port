angular.module('el1.login', ['ionic', 'ionic-material', 'ionMdInput', 'el1.services.commun', 'el1.model'])
    .config(function ($stateProvider) {

        $stateProvider.state('app.login', {
          url: '/login',
          views: {
            'menuContent': {
              templateUrl: 'templates/el1-login.tpl.html',
              controller: 'LoginCtrl'
            },
            'fabContent': {
              template: ''
            }
          }
        });

    })
    .controller('LoginCtrl', function($state, $rootScope, $scope, $http, $location, AuthService, Env, $log, $timeout, $stateParams, ionicMaterialInk) {
            $scope.$parent.clearFabs();
            /*
            TEMP
              $timeout(function() {
              $scope.$parent.hideHeader();
            }, 0);
            ionicMaterialInk.displayEffect();*/

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
