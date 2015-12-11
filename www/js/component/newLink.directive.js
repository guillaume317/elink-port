'use strict';

angular.module('starter')
    .directive('newlink', function($rootScope, LiensService, $ionicPopup, $timeout) {
		return {
            restrict: 'E',

            template:
              '<button id="fab-newLink" ng-click="newLink()" class="button button-fab button-fab-top-right expanded button-energized-900 drop"><i class="icon ion-plus-round"></i></button>',

			controller: ['$scope', '$log', '$rootScope', 'LiensService', '$ionicPopup', '$timeout',
	            function($scope, $log, $rootScope, LiensService, $ionicPopup, $timeout) {
                $log.info("directive newLink")

                $timeout(function() {
                  document.getElementById('fab-newLink').classList.toggle('on');
                }, 200);

                $scope.currentLien= {"url" : "", private: true};
                $scope.alerts = [];

                $scope.newLink = function () {
                      var myPopup = $ionicPopup.show({
                        templateUrl: 'templates/el1-newLink.tpl.html',
                        scope: $scope,
                        buttons: [
                          {text: '<i class="icon ion-close-round"></i>'},
                          {
                            text: '<i class="icon ion-checkmark"></i>',
                            type: 'button-positive',
                            onTap: function (e) {
                              if (!$scope.currentForm.$valid) {
                                e.preventDefault();
                              } else {

                                LiensService.createLinkForUser(currentLien, $rootScope.userConnected.$id)
                                  .then(function (newLink) {
                                    return "Valider";
                                  }, function (error) {
                                    $log.error(error);
                                  }
                                );
                              }
                            } // onTap
                          }, // button valider
                        ]
                      });

                      myPopup.then(function (res) {
                        console.log('Tapped!', res);
                      });

                      $timeout(function () {
                        myPopup.close(); //close the popup after 120 seconds
                      }, 120000);
                }; // fin function newLink


	            } // fin controller
	        ]
        }
    });
