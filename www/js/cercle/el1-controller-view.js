(function () {

  angular
    .module('el1.cercle')
    .controller('cercleController', [
      '$log', '$scope', '$state',
      'LiensService', 'SessionStorage', 'USERFIREBASEPROFILEKEY', 'ToastManager', 'Loader',
      'liens',
      'allCategories',
      'allMyCercles',
      '$stateParams', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion',
      CercleController
    ])
    .controller('icdcController', [
      '$log', '$scope',
      'LiensService',
      'allCategories',
      'topTen',
      'SessionStorage',
      'USERFIREBASEPROFILEKEY','ToastManager', 'Loader', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion',
      ICDCController
    ])
  ;

  /**
   */
  function CercleController($log, $scope, $state, LiensService, SessionStorage, USERFIREBASEPROFILEKEY, ToastManager, Loader, liens, allCategories, allMyCercles, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {

    //on masque la mire de loading
    Loader.hide();

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    $scope.replayAnimation = function() {
      $timeout(function () {
        ionicMaterialMotion.fadeSlideIn({
          selector: '.animate-fade-slide-in .item'
        });
      }, 200);
    }

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    $scope.allLiens = liens;
    $scope.categories = allCategories;
    $scope.cercles = allMyCercles;
    $scope.cercle = allMyCercles[0];

    $scope.filter = {"category": ""};

    if (allMyCercles[0]) {
      $scope.data = {
        "selectedCercle" : allMyCercles[0]
      };
    }
    $scope.replayAnimation();


    $scope.changeCercle = function () {
      Loader.show("Extraction des données en cours ...");
      LiensService.findLinksByCerlceName($scope.data.selectedCercle.$id)
        .then(function (links) {
          Loader.hide();
          $scope.allLiens = links;
          $scope.replayAnimation();
        });
    };

    $scope.changeCategory = function() {
      $scope.replayAnimation();
    }


    $scope.like = function (alink) {
      LiensService.addLike($scope.data.selectedCercle.$id, alink, liens)
        .then(function(cercleLinkLike){
          ToastManager.displayToast("Le lien a été liké !");
        });

    };


    $scope.moveToBiblio = function (alink) {
      alink.private = "biblio";
      LiensService.createLinkForUser(alink, SessionStorage.get(USERFIREBASEPROFILEKEY).uid)
        .then(function(lienAdded){
          ToastManager.displayToast("Le lien a été déplacé dans l'espace Biblio");
        })
    };

    $scope.showURL = function (alink) {
      window.open(alink.url, '_system', 'location=yes');
    };

  }


  /**
   */
  function ICDCController($log, $scope, LiensService, allCategories, topTen, SessionStorage, USERFIREBASEPROFILEKEY, ToastManager, Loader, $timeout, ionicMaterialInk, ionicMaterialMotion) {

    //on masque la mire de loading
    Loader.hide();

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
      $scope.isExpanded = true;
      $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    $scope.replayAnimation = function() {
      $timeout(function () {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
        ionicMaterialMotion.fadeSlideInRight()
      }, 300);
    };

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    $scope.replayAnimation();

    $scope.topTen= topTen;
    $scope.categories= allCategories;
    $scope.filter= { "category" : "" };

    $scope.doRefresh = function() {

      LiensService.findTopTenLinks()
        .then(function(topTenRefresh) {
          $scope.topTen= topTenRefresh;
        })
        .finally(function() {
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
            $scope.replayAnimation();
          });
    };

    $scope.changeCategory = function() {
      $scope.replayAnimation();
    }

    $scope.moveToBiblio = function (alink) {
      alink.private = "biblio";
      LiensService.createLinkForUser(alink, SessionStorage.get(USERFIREBASEPROFILEKEY).uid)
        .then(function(lienAdded){
          ToastManager.displayToast("Le lien a été déplacé dans l'espace Biblio");
        })
    };

    $scope.showURL= function(lien) {
      window.open(lien.url, '_blank');
    }


  }

})();
