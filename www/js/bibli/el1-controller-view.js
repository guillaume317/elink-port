(function(){

    angular
        .module('el1.bibli')
        .controller('bibliController', [
            '$log', '$scope', '$rootScope', '$state',
            'LiensService',
            'liensNonLus', 'liensLus', 'allMyCercles', 'allCategories',
            '$ionicPopup',
            '$stateParams', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion',
            BibliController
            ]);


    /**
     */
    function BibliController($log, $scope, $rootScope, $state, LiensService , liensNonLus, liensLus, allMyCercles, allCategories, $ionicPopup, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion ) {
      $scope.$parent.showHeader();
      $scope.$parent.clearFabs();
      $scope.isExpanded = true;
      $scope.$parent.setExpanded(true);
      $scope.$parent.setHeaderFab('right');

      $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
          selector: '.animate-fade-slide-in .item'
        });
      }, 200);

      // Activate ink for controller
      ionicMaterialInk.displayEffect();

      //liens : liens non lus ou biblio selon le cas

      if ($state.current.name === 'bibli-nonLu') {
          $scope.liens = liensNonLus;
      } else {
          $scope.liens = liensLus;
      }

      $scope.showURL= function(lien) {
          window.open(lien.url, '_system', 'location=yes');
      };

        $scope.canShare= function() {
            return allMyCercles && allMyCercles[0];
        };

        $scope.deleteLink= function(lien) {
            // $scope.liens est synchronisé avec la base
            $scope.liens.$remove(lien);
        };

        $scope.moveTo = function(lien) {
            //cas des liens non lus
            if ($state.current.name === 'app.bibli-nonLu') {
                //Ajout dans biblio
                liensLus.$add(lien);
            } else {
                //Ajout dans non lus
                liensNonLus.$add(lien);
            }
            //Suppression du lien de la liste
            $scope.deleteLink(lien);
        };


        $scope.share= function(ev, lien) {
            $scope.categories= allCategories;
            $scope.cercles= allMyCercles;
            $scope.linkToShare = lien;

            //Initialisation du lien à basculer vers un cercle donné pour une catégorie donnée
            $scope.shareLink=  {
              title: lien.title,
              teasing: lien.teasing,
              createdOn : lien.createdOn,
              url : lien.url,
              cercleName: allMyCercles[0].$id,
              category: allCategories[0]
            }

            var myPopup = $ionicPopup.show({
              templateUrl: 'templates/el1-share.tpl.html',
              scope: $scope,
              buttons: [
                { text: '<i class="icon ion-close-round"></i>' },
                {
                  text: '<i class="icon ion-checkmark"></i>',
                  type: 'button-positive',
                  onTap: function(e) {
                    if (! $scope.currentForm.$valid) {
                      e.preventDefault();
                    } else {
                      //Lorsque le lien est partagé :
                      //   il est supprimé de read ou notRead
                      //   il est déplacé vers le cercle cible (cercleLinks)
                      //   il est associé à une catégorie (attribut category)
                      GestionService.shareLien(shareLink, $rootScope.userConnected.$id)
                        .then(function() {
                          listeLiens.$remove(linkToShare);
                          return "Valider";
                        })
                        .catch (function(error) {
                          $log.error(error);
                        })
                    }
                  } // onTap
                }, // button Partager
              ]
            });

            myPopup.then(function(res) {
              console.log('Tapped!', res);
            });

            $timeout(function() {
              myPopup.close(); //close the popup after 120 seconds
            }, 120000);
        }; // fin scope.share

    }

})();
