(function (module) {

  'use strict';
  module.config(function ($stateProvider) {

    $stateProvider.state('app.bibli-nonLu', {
      url: '/bibli/nonLu',
      views: {
        'menuContent': {
          templateUrl: 'templates/el1-nonLu.tpl.html',
          controller: 'bibliController',
          resolve: {
            liensNonLus: ['$rootScope', 'LiensService', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
              function ($rootScope, LiensService, SessionStorage, USERFIREBASEPROFILEKEY) {
                return LiensService.findNotReadLinksByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
              }],
            liensLus: ['$rootScope', 'LiensService', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
              function ($rootScope, LiensService, SessionStorage, USERFIREBASEPROFILEKEY) {
                return LiensService.findReadLinksByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
              }],
            allMyCercles: ['$rootScope', 'UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
              function ($rootScope, UsersManager, SessionStorage, USERFIREBASEPROFILEKEY) {
                return UsersManager.findCerclesByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
              }],
            allCategories: ['LiensService', function (LiensService) {
              return LiensService.findCategories();
            }]
          }
        },
        'fabContent': {
          template: '<button id="fab-nonlu" on-tap="newLinkModal.show()" class="button button-fab button-fab-bottom-right button-energized-900 flip"><i class="icon ion-plus"></i></button>',
          controller: ['$scope', '$log', '$rootScope', 'LiensService', 'commonsService', 'SessionStorage', 'USERFIREBASEPROFILEKEY', 'ToastManager', '$ionicPopup', '$timeout', '$ionicModal',
            function ($scope, $log, $rootScope, LiensService, commonsService, SessionStorage, USERFIREBASEPROFILEKEY, ToastManager, $ionicPopup, $timeout, $ionicModal) {

              $scope.currentLien = {"url": "", "title": "", "private": false};
              $scope.message = "";

              $ionicModal.fromTemplateUrl('templates/el1-newLink-modal.tpl.html', {
                scope: $scope,
                animation: 'slide-in-up'
              }).then(function (modal) {
                $scope.newLinkModal = modal;
              });

              $scope.addLink = function () {

                if (!commonsService.isUrlValid($scope.currentLien.url)) {
                  $scope.message = "Format URL non valide ! ";
                } else {

                  $scope.currentLien.private = $scope.currentLien.private ? "biblio" : "nonlu";
                  LiensService.createLinkForUser($scope.currentLien, SessionStorage.get(USERFIREBASEPROFILEKEY).uid)
                    .then(function (newLink) {
                      $scope.newLinkModal.hide();
                      ToastManager.displayToast("Le lien a été ajouté dans l'espace courant");
                      $scope.$parent.recount();
                      $scope.$parent.replayAnimation();
                    })
                    .catch(function (error) {
                      $log.error(error);
                    })
                    .finally(function () {
                      $scope.currentLien = {"url": "", "title": "", "private": false};
                    })
                }

              };

              $scope.cancelLink = function () {
                $scope.newLinkModal.hide();
                $scope.currentLien = {"url": "", "title": "", "private": false};
              };

              $timeout(function () {
                document.getElementById('fab-nonlu').classList.toggle('on');
              }, 900);

            }]

        }
      },
      resolve: {
        currentAuth: ['FBFactory', function (FBFactory) {
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
            liensNonLus: ['$rootScope', 'LiensService', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
              function ($rootScope, LiensService, SessionStorage, USERFIREBASEPROFILEKEY) {
                return LiensService.findNotReadLinksByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
              }],
            liensLus: ['$rootScope', 'LiensService', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
              function ($rootScope, LiensService, SessionStorage, USERFIREBASEPROFILEKEY) {
                return LiensService.findReadLinksByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
              }],
            allMyCercles: ['$rootScope', 'UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
              function ($rootScope, UsersManager, SessionStorage, USERFIREBASEPROFILEKEY) {
                return UsersManager.findCerclesByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
              }],
            allCategories: ['LiensService', function (LiensService) {
              return LiensService.findCategories();
            }]
          }
        },
        'fabContent': {
          template: '<button id="fab-biblio" on-tap="newLinkModal.show()" class="button button-fab button-fab-bottom-right button-energized-900 spin"><i class="icon ion-plus"></i></button>',
          controller: ['$scope', '$log', '$rootScope', 'LiensService', 'commonsService', 'SessionStorage', 'USERFIREBASEPROFILEKEY', 'ToastManager', '$ionicPopup', '$timeout', '$ionicModal',
            function ($scope, $log, $rootScope, LiensService, commonsService, SessionStorage, USERFIREBASEPROFILEKEY, ToastManager, $ionicPopup, $timeout, $ionicModal) {

              $scope.currentLien = {"url": "", "title": "", "private": false};
              $scope.message = "";

              $ionicModal.fromTemplateUrl('templates/el1-newLink-modal.tpl.html', {
                scope: $scope,
                animation: 'slide-in-up'
              }).then(function (modal) {
                $scope.newLinkModal = modal;
              });

              $scope.addLink = function () {

                if (!commonsService.isUrlValid($scope.currentLien.url)) {
                  $scope.message = "Format URL non valide ! ";
                } else {

                  $scope.currentLien.private = $scope.currentLien.private ? "biblio" : "nonlu";
                  LiensService.createLinkForUser($scope.currentLien, SessionStorage.get(USERFIREBASEPROFILEKEY).uid)
                    .then(function (newLink) {
                      $scope.newLinkModal.hide();
                      ToastManager.displayToast("Le lien a été ajouté dans l'espace courant");
                      $scope.$parent.recount();
                      $scope.$parent.replayAnimation();
                    })
                    .catch(function (error) {
                      $log.error(error);
                    })
                    .finally(function () {
                      $scope.currentLien = {"url": "", "title": "", "private": false};
                    })
                }

              };

              $scope.cancelLink = function () {
                $scope.newLinkModal.hide();
                $scope.currentLien = {"url": "", "title": "", "private": false};
              };

              $timeout(function () {
                document.getElementById('fab-biblio').classList.toggle('on');
              }, 900);

            }]
        }
      },
      resolve: {
        currentAuth: ['FBFactory', function (FBFactory) {
          return FBFactory.auth().$requireAuth();
        }]
      }
    });

  });

}(angular.module('el1.bibli', ['ionic', 'ionic-material', 'ionMdInput', 'el1.services.commun', 'el1.model'])));
