(function () {

  angular
    .module('el1.bibli')
    .controller('bibliController', [
      '$log', '$scope', '$rootScope', '$state',
      'LiensService', 'GestionService', 'UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY', 'ToastManager', 'Loader',
      'liensNonLus', 'liensLus', 'allMyCercles', 'allCategories',
      '$ionicPopup',
      '$stateParams', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion', '$cordovaDialogs',
      BibliController
    ]);


  /**
   */
  function BibliController($log, $scope, $rootScope, $state, LiensService, GestionService, UsersManager, SessionStorage, USERFIREBASEPROFILEKEY, ToastManager, Loader, liensNonLus, liensLus, allMyCercles, allCategories, $ionicPopup, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $cordovaDialogs) {

    //on masque la mire de loading
    Loader.hide();

    //Pour les badges du menu de droite
    $rootScope.countNonLu = liensNonLus.length;
    $rootScope.countBiblio = liensLus.length;
    $rootScope.countCercle = allMyCercles.length;

    $scope.recount = function() {
      $rootScope.countNonLu = liensNonLus.length;
      $rootScope.countBiblio = liensLus.length;
    };

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

    $scope.replayAnimation = function () {
      $timeout(function () {
        ionicMaterialMotion.fadeSlideIn({
          selector: '.animate-fade-slide-in .item'
        });
      }, 200);
    };

    $scope.replayAnimation();

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    //liens : liens non lus ou biblio selon le cas

    if ($state.current.name === 'app.bibli-nonLu') {
      $scope.liens = liensNonLus;
    } else {
      $scope.liens = liensLus;
    }

    $scope.doRefresh = function () {
      if ($state.current.name === 'app.bibli-nonLu') {
        LiensService.findNotReadLinksByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid)
          .then(function (liensNonLusRefresh) {
            $scope.liens = liensNonLusRefresh;
          })
          .finally(function () {
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
            $scope.replayAnimation();
          });
      } else {
        LiensService.findReadLinksByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid)
          .then(function (liensLusRefresh) {
            $scope.liens = liensLusRefresh;
          })
          .finally(function () {
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
            $scope.replayAnimation();
          });
      }
      UsersManager.findCerclesByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid)
        .then(function (cerclesRefresh) {
          allMyCercles = cerclesRefresh;
        });
    };

    //TODO utilisation cordova-plugin-inappbrowser
    $scope.showURL = function (lien) {
      window.open(lien.url, '_system', 'location=yes');
    };

    $scope.canShare = function () {
      return allMyCercles && allMyCercles[0];
    };

    $scope.deleteLink = function (lien) {

      //Demande confirmation suppression du lien
      $cordovaDialogs.confirm('Confirmez-vous la suppression de ce lien ?', 'Attention', ['Confirmer', 'Annuler']).then(
        function (choix) {
          // Choix -> Integer: 0 - no button, 1 - button 1, 2 - button 2
          if (choix === 1) {
            // $scope.liens est synchronisé avec la base
            $scope.liens.$remove(lien).then(function () {
              $scope.recount();
              ToastManager.displayToast("Le lien a été supprimé");
            });
          }
        });
    };

    $scope.moveTo = function (lien) {

      // on conserve l'id original du lien dans keyOri
      if (!lien.keyOri) {
        lien.keyOri = lien.$id;
      }

      //cas des liens non lus
      if ($state.current.name === 'app.bibli-nonLu') {
        //Ajout dans biblio
        liensLus.$add(lien);
      } else {
        //Ajout dans non lus
        liensNonLus.$add(lien);
      }
      //Suppression du lien de la liste
      $scope.liens.$remove(lien).then(function() {
        $scope.recount();
        ToastManager.displayToast("Le lien a été déplacé !");
      });
      //$scope.deleteLink(lien);
    };

    $scope.share = function (ev, lien) {

      $scope.categories = allCategories;
      $scope.cercles = allMyCercles;
      $scope.linkToShare = lien;

      // on trace l'id original
      var keyOri;
      if (lien.keyOri) {
        keyOri = lien.keyOri;
      } else {
        keyOri = lien.$id
      }

      //Initialisation du lien à basculer vers un cercle donné pour une catégorie donnée
      $scope.shareLink = {
        title: lien.title,
        teasing: lien.teasing,
        createdOn: lien.createdOn,
        url: lien.url,
        cercleName: allMyCercles[0].$id,
        category: allCategories[0],
        keyOri: keyOri
      }

      var myPopup = $ionicPopup.show({
        title: 'Partage',
        templateUrl: 'templates/el1-share.tpl.html',
        scope: $scope,
        buttons: [
          {text: '<i class="icon ion-close-round"></i>'},
          {
            text: '<i class="icon ion-checkmark"></i>',
            type: 'button-positive',
            onTap: function (e) {
              //Lorsque le lien est partagé :
              //   il est supprimé de read ou notRead
              //   il est déplacé vers le cercle cible (cercleLinks)
              //   il est associé à une catégorie (attribut category)
              return $scope.shareLink;
            } // onTap
          }, // button Partager
        ]
      });

      myPopup.then(function (shareLink) {
        //Récupération du lien ajouté
        GestionService.shareLien(shareLink, SessionStorage.get(USERFIREBASEPROFILEKEY))
          .then(function () {
            $scope.liens.$remove(lien).then(function() {$scope.recount();});
            ToastManager.displayToast("Le lien a été partagé avec le cercle " + shareLink.cercleName);
            return "Valider";
          })
          .catch(function (error) {
          $log.error(error);
        })
      });

      $timeout(function () {
        myPopup.close(); //close the popup after 120 seconds
      }, 120000);
    }; // fin scope.share

  }

})();
