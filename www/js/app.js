// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic-material', 'ionMdInput', 'firebase', 'el1.login', 'el1.cercle', 'el1.bibli', 'el1.model', 'el1.services.commun'])

  .run(function($ionicPlatform, Env, UsersManager,  $rootScope) {
    $ionicPlatform.ready(function() {
      var config={
        "backendfirebase": "https://challenge-elink.firebaseio.com/"
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

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
  });
