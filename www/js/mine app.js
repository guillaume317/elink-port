// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
//angular.module('starter', ['ionic', 'ionic-material', 'ionMdInput', 'firebase', 'el1.accueil', 'el1.login', 'el1.bibli', 'el1.model', 'el1.services.commun'])
angular.module('starter', ['ionic', 'ionic-material', 'ionMdInput', 'firebase', 'starter.controllers', 'el1.model', 'el1.services.commun', 'el1.accueil', 'el1.login'])

.run(function($ionicPlatform, $rootScope, Env, UsersManager) {
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


    $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
      $rootScope.toState = toState;
      $rootScope.toStateParams = toStateParams;
    });

    $rootScope.$on('$stateChangeSuccess',  function(event, toState, toParams, fromState, fromParams) {
      var titleKey = 'global.title' ;

      $rootScope.previousStateName = fromState.name;
      $rootScope.previousStateParams = fromParams;

      // Set the page title key to the one configured in state or use default one
      if (toState.data.pageTitle) {
        titleKey = toState.data.pageTitle;
      }



    });

    $rootScope.back = function() {
      // If previous state is 'activate' or do not exist go to 'home'
      if ($rootScope.previousStateName === 'activate' || $state.get($rootScope.previousStateName) === null) {
        $state.go('home');
      } else {
        $state.go($rootScope.previousStateName, $rootScope.previousStateParams);
      }
    };



    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
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


    // if none of the above states are matched, use this as the fallback

    $urlRouterProvider.otherwise('/home');
  });
