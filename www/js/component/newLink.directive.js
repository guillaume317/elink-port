'use strict';

angular.module('starter')
    .directive('newlink', function($rootScope, LiensService, commonsService, $ionicPopup, $timeout) {
		return {
            restrict: 'E',

            template:
              '<button id="fab-newLink" ng-click="newLink()" class="button button-fab button-fab-top-left expanded button-energized-900 drop"><i class="icon ion-plus-round"></i></button>',

			controller: ['$scope', '$log', '$rootScope', 'LiensService', 'commonsService', 'SessionStorage', 'USERFIREBASEPROFILEKEY', '$ionicPopup', '$timeout',
	            function($scope, $log, $rootScope, LiensService, commonsService, SessionStorage, USERFIREBASEPROFILEKEY, $ionicPopup, $timeout) {
                $log.info("directive newLink")

                $timeout(function() {
                  if (document.getElementById('fab-newLink') && document.getElementById('fab-newLink').classList) {
                    document.getElementById('fab-newLink').classList.toggle('on');
                  }
                }, 200);

                $scope.currentLien= {"url" : "", "private": false};
                $scope.alerts = [];
                $scope.message="";

                $scope.newLink = function () {
                      var myPopup = $ionicPopup.show({
                        title : 'Nouveau lien',
                        templateUrl: 'templates/el1-newLink.tpl.html',
                        scope: $scope,
                        buttons: [
                          {text: '<i class="icon ion-close-round"></i>'},
                          {
                            text: '<i class="icon ion-checkmark"></i>',
                            type: 'button-positive',
                            onTap: function (e) {
                              if (! commonsService.isUrlValid($scope.currentLien.url) ) {
                                  $scope.message= "Mauvais format d'url";
                                  e.preventDefault();
                              } else {
                                return $scope.currentLien;
                              }
                            } // onTap
                          }, // button valider
                        ]
                      });

                      myPopup.then(function (nouveauLien) {
                        nouveauLien.private = nouveauLien.private ? "biblio": "nonlu";
                        LiensService.createLinkForUser(nouveauLien, SessionStorage.get(USERFIREBASEPROFILEKEY).uid)
                          .then(function (newLink) {
                            return "Valider";
                          })
                          .catch (function(error) {
                            $log.error(error);
                          }
                        )
                      });

                      $timeout(function () {
                        myPopup.close(); //close the popup after 120 seconds
                      }, 120000);
                }; // fin function newLink


	            } // fin controller
	        ]
        }
    });
