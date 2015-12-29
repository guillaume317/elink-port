// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic-material', 'ionMdInput', 'ion-autocomplete', 'ngCordova', 'firebase', 'el1.login', 'el1.gestion', 'el1.truc', 'el1.cercle', 'el1.bibli', 'el1.model', 'el1.services.commun'])

  .run(function($ionicPlatform, Env, UsersManager,  $rootScope, $cordovaNetwork, $cordovaSplashscreen, $cordovaAppVersion, $cordovaDevice, $cordovaStatusbar, $ionicLoading, $state, Loader) {

    $ionicPlatform.ready(function() {

      //Traitement plugion android
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }

      $cordovaStatusbar.overlaysWebView(true);
      $cordovaStatusbar.styleHex('#E53935');

      // ** A l'écoute du réseau */
      $rootScope.networkOnLine = $cordovaNetwork.isOnline();

      $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
        $rootScope.networkOnLine = true;
      });

      $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
        $rootScope.networkOnLine = false;
      });

      /** Recherche d'information sur le device */
      $cordovaAppVersion.getVersionNumber().then(function (version) {
        $rootScope.versionNumber = version;
      });

      $cordovaAppVersion.getVersionCode().then(function (build) {
        $rootScope.versionCode = build;
      });

      $rootScope.myDevice = $cordovaDevice.getPlatform() + " - " + $cordovaDevice.getVersion() + " - " + $cordovaDevice.getModel() + " - " + $cordovaDevice.getUUID();

      $rootScope.currentTargetState = 'app.bibli-nonLu';

      $rootScope.loadTargetState = function(nextTargetState) {
        if (nextTargetState !== $rootScope.currentTargetState) {
          Loader.show("Extraction des données en cours...");
          $rootScope.currentTargetState = nextTargetState;
        }
        $state.go(nextTargetState);
      }

      //on masque le spashscreen
      $cordovaSplashscreen.hide();

    });

    $rootScope.userAuthenticated = false;

    $rootScope.$on('$stateChangeError',
      function(event, toState, toParams, fromState, fromParams, error) {
        if (error === 'AUTH_REQUIRED') {
          $state.go('app.login');
        }
      });

    $rootScope.networkOnLine = true;

    $rootScope.$on('link.addComplete', function(event){
      event.stopPropagation();
      $rootScope.$broadcast('link.addCompleteFromParent')
    });

    var config={
      "backendfirebase": "https://elink.firebaseio.com/"
    };
    Env.init(config);


  })

  .constant('RESTBACKEND', 'http://localhost:8080/banconet/api/v1')

  .constant('FBURL', 'https://elink.firebaseio.com/')

  .constant('GOOGLEAUTHSCOPE', 'email, profile')

  .constant('USERFIREBASEPROFILEKEY', 'firebase:session::elink')

  .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

    /*
     // Turn off back button text
     $ionicConfigProvider.backButton.previousTitleText(false);
     */

    $stateProvider.state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/el1-menu.tpl.html',
      controller: 'AppCtrl'
    });
/*
    $stateProvider.state('home', {
      url: '/home',

      views: {
        'menuContent': {
          templateUrl: 'templates/accueil.tpl.html',
          controller: 'AccueilCtrl'
        },
        'fabContent': {
          template: ''
        }
      }

    });
/*
    $stateProvider.state('home', {
      url: '/home',
      templateUrl: 'templates/accueil.tpl.html',
      controller: 'AccueilCtrl'
    });
*/
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('app/login');
  });
