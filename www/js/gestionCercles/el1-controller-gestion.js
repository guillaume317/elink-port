(function () {

  angular
    .module('el1.gestion')
    .controller('gestionController', [
      '$log', '$scope', '$rootScope', '$q', '$timeout',
      'GestionService', 'UsersManager', 'commonsService',
      'mesInvitations', 'personnesDuCercle', 'mesCercles', 'usersEmail',
      'SessionStorage', 'USERFIREBASEPROFILEKEY', 'ToastManager', 'Loader',
      '$ionicPopup',
      'ionicMaterialInk', 'ionicMaterialMotion', '$ionicModal',
      GestionController
    ]);

  /**
   */
  function GestionController($log, $scope, $rootScope, $q, $timeout, GestionService, UsersManager, commonsService, mesInvitations, personnesDuCercle, mesCercles, usersEmail, SessionStorage, USERFIREBASEPROFILEKEY, ToastManager, Loader, $ionicPopup, ionicMaterialInk, ionicMaterialMotion, $ionicModal) {

    //on masque la mire de loading
    Loader.hide();

    $scope.recount = function() {
      $rootScope.countCercle = mesCercles.length;
    };
    $scope.mesInvitations = mesInvitations;
    $scope.personnes = personnesDuCercle;
    $scope.cercles = mesCercles;
    $scope.users = usersEmail;

    $scope.selectedItemChange = selectedItemChange;
    $scope.searchTextChange = searchTextChange;
    $scope.querySearch = querySearch;
    $scope.selectedItem = null;
    $scope.invited = [];
    $scope.invitedDisplay = "";

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    $scope.replayAnimation = function () {
      $timeout(function () {
        ionicMaterialMotion.fadeSlideIn({
          selector: '.animate-fade-slide-in .item'
        });
      }, 200);
    };
    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    $scope.replayAnimation();

    //Functions utilisée par le select box autocomplete
    function querySearch(query) {
      var results = query ? $scope.users.filter(createFilterFor(query)) : $scope.users,
        deferred;
      deferred = $q.defer();
      $timeout(function () {
        deferred.resolve(results);
      }, Math.random() * 1000, false);
      return deferred.promise;

    }

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(user) {
        return (user.email.indexOf(lowercaseQuery) === 0);
      };
    }

    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(user) {
      //sélection d'un élémenta dans la liste
      $log.info('Item changed to ' + JSON.stringify(user));
      //si l'objet a été sélectionné, il n'est pas vide

    }

    if (mesCercles[0]) {
      $scope.data = {
        "selectedCercle": mesCercles[0]
      };
    }

    $scope.currentCercle = {"label" : "", "description": ""};
    $scope.message = "";

    $ionicModal.fromTemplateUrl('templates/el1-nouveauCercle.tpl.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.newCercleModal = modal;
    });

    $scope.cancelCercle = function() {
      $scope.newCercleModal.hide();
      $scope.currentCercle = {"label" : "", "description": ""};
    };

    $scope.addCercle = function() {
      GestionService.createCercle($scope.currentCercle)
        .then(function (cerclename) {
          $scope.newCercleModal.hide();
          $scope.recount();
          ToastManager.displayToast('Le cercle ' + cerclename + ' a été créé.');
        })
        .catch(function (error) {
          $scope.message = "Erreur lors de la sauvegarde du cercle !";
          $log.error(error);
        })
        .finally(function() {
          $scope.currentCercle = {"label" : "", "description": ""};
        })
    };

    $scope.nouveauCercle = function (ev) {
      $scope.currentCercle = {};
      $scope.alerts = [];

      var myPopup = $ionicPopup.show({
        title: 'Nouveau Cercle',
        templateUrl: 'templates/el1-nouveauCercle.tpl.html',
        scope: $scope,
        buttons: [
          {text: '<i class="icon ion-close-round"></i>'},
          {
            text: '<i class="icon ion-checkmark"></i>',
            type: 'button-positive',
            onTap: function (e) {
              return $scope.currentCercle;
            } // onTap
          }, // button nouveau cercle
        ]
      });

      myPopup.then(function (newCercle) {
        GestionService.createCercle(newCercle)
          .then(function (cerclename) {
            $scope.recount();
            ToastManager.displayToast('Le cercle ' + cerclename + ' a été créé.');
            return "Valider";
          }, function (error) {
            $log.error(error);
          }
        );

      });

      $timeout(function () {
        myPopup.close(); //close the popup after 120 seconds
      }, 120000);

    }; // fin scope.nouveauCercle

    $scope.changeCercle = function () {

      //Changement de cercle
      //==> récupération des personnes du cercle choisi
      GestionService.findPersonnesByCercle($scope.data.selectedCercle)
        .then(function (personnes) {
          $scope.personnes = personnes;
          $scope.replayAnimation();
        })
        .catch(function (error) {
          $log.error(error);
        })
    }

    $scope.inviter = function (invite) {

      if (invite !== null) {
        //L'utilisateur connecté invite un utilisateur à rejoindre le cercle sélectionné
        UsersManager.inviter(invite.uid, $scope.data.selectedCercle.$id)
          .then(function (username) {
            $scope.invited.push(invite.email);
            $scope.invitedDisplay = $scope.invited.join(', ');
            $scope.selectedItem = null;
            $scope.searchText = null;
            $scope.selectedItem = "";
            ToastManager.displayToast(invite.email + ' a été invité à rejoindre le cercle ' + $scope.data.selectedCercle.$id);
          })
          .catch(function (error) {
            $log.error(error);
          })
      }
    }

    $scope.accepterInvitation = function (invitation) {
      // Si l'utilisateur connecté accepte l'invitation
      // ==> Ajout du cercle au niveau du user.
      // ==> Ajout de l'utilisateur au niveau des membres du cercle
      // ==> Suppression de l'invitation en attente
      // ==> Recharcher la liste ?
      GestionService.accepterInvitation(SessionStorage.get(USERFIREBASEPROFILEKEY).uid, invitation.$id)
        .then(function (userId) {
          $scope.recount();
          ToastManager.displayToast('Vous avez rejoint le cercle ' + invitation.$id);
        })
        .catch(function (error) {
          $log.error(error);
        });
    }

  }

})();
