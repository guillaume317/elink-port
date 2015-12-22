'use strict';

angular.module('starter')
  .directive('newlink', function ($rootScope, LiensService, commonsService, $ionicPopup, $timeout) {
    return {
      restrict: 'E',

      template: '<button id="fab-newLink"  on-tap="newLinkModal.show()" class="button button-fab button-fab-top-right expanded button-energized-900 drop"><i class="icon ion-plus-round"></i></button>',

      controller: ['$scope', '$log', '$rootScope', 'LiensService', 'commonsService', 'SessionStorage', 'USERFIREBASEPROFILEKEY', 'ToastManager', '$ionicPopup', '$timeout', '$ionicModal',
        function ($scope, $log, $rootScope, LiensService, commonsService, SessionStorage, USERFIREBASEPROFILEKEY, ToastManager, $ionicPopup, $timeout, $ionicModal) {

          $timeout(function () {
            if (document.getElementById('fab-newLink') && document.getElementById('fab-newLink').classList) {
              document.getElementById('fab-newLink').classList.toggle('on');
            }
          }, 200);

          $scope.currentLien = {"url": "", "title":"", "private": false};
          $scope.alerts = [];
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
              LiensService.createLinkForUser(nouveauLien, SessionStorage.get(USERFIREBASEPROFILEKEY).uid)
                .then(function (newLink) {
                  $scope.newLinkModal.hide();
                  ToastManager.displayToast("Le lien a été ajouté dans l'espace courant");
                  $scope.$parent.recount();
                  $scope.$parent.replayAnimation();
                })
                .catch(function (error) {
                  $log.error(error);
                })
                .finally(function() {
                  $scope.currentLien = {"url": "", "title":"", "private": false};
                })
            }

          };

          $scope.cancelLink = function () {
            $scope.newLinkModal.hide();
            $scope.currentLien = {"url": "", "title":"", "private": false};
          };

          $scope.newLinkOld = function () {

            var myPopup = $ionicPopup.show({
              title: 'Nouveau lien',
              templateUrl: 'templates/el1-newLink.tpl.html',
              scope: $scope,
              buttons: [
                {text: '<i class="icon ion-close-round"></i>'},
                {
                  text: '<i class="icon ion-checkmark"></i>',
                  type: 'button-positive',
                  onTap: function (e) {
                    if (!commonsService.isUrlValid($scope.currentLien.url)) {
                      $scope.message = "Mauvais format d'url";
                      e.preventDefault();
                    } else {
                      return $scope.currentLien;
                    }
                  } // onTap
                }, // button valider
              ]
            });

            myPopup.then(function (nouveauLien) {
              nouveauLien.private = nouveauLien.private ? "biblio" : "nonlu";
              LiensService.createLinkForUser(nouveauLien, SessionStorage.get(USERFIREBASEPROFILEKEY).uid)
                .then(function (newLink) {
                  ToastManager.displayToast("Le lien a été ajouté dans l'espace courant");
                  $scope.$parent.recount();
                  $scope.$parent.replayAnimation();
                  return "Valider";
                })
                .catch(function (error) {
                  $log.error(error);
                }
              )
            });

            $timeout(function () {
              myPopup.close(); //close the popup after 120 seconds
            }, 120000);
          }; // fin function newLinkOld

        } // fin controller
      ]
    }
  });
