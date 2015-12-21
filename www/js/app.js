// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic-material', 'ionMdInput', 'ion-autocomplete', 'ngCordova', 'firebase', 'el1.login', 'el1.gestion', 'el1.truc', 'el1.cercle', 'el1.bibli', 'el1.model', 'el1.services.commun'])

  .run(function($ionicPlatform, Env, UsersManager,  $rootScope) {
    $ionicPlatform.ready(function() {

      $rootScope.userAuthenticated = false;
/*
      TODO


      $rootScope.$on('$stateChangeError',
        function(event, toState, toParams, fromState, fromParams, error) {
          if (error === 'AUTH_REQUIRED') {
            $state.go('app.login');
          }
        });
*/
      var config={
        "backendfirebase": "https://elink.firebaseio.com/"
      };
      Env.init(config);


      //Extraction de l'utilisateur connecté / Matthieu par défaut
      // @Author MG
      // TODO merger à terme avec la représentation $rootScope.user

      $rootScope.userConnected = {
        $id: "Matthieu",
        email: "matthieu.guillemette@caissedesdepots.fr",
        firstname: "Matthieu",
        fullname: "Matthieu Guillemette",
        lastname: "Guillemette"
      };
      UsersManager.getUser("Matthieu")
        .then(function(user) {
          $rootScope.userConnected = user;
        });

      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
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
