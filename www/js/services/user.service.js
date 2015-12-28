/**
 * Created by Guillemette on 08/12/2015.
 */
(function () {
  'use strict';

  angular.module('el1.services.commun')
    .service('UsersManager', ['$firebaseObject', '$firebaseArray', '$q', 'FBURL', 'EscapeUtils', UsersManager]);

  function UsersManager($firebaseObject, $firebaseArray, $q, FBURL, EscapeUtils) {

    var ref = new Firebase(FBURL);

    return {
      /**
       {
           "provider":"google",
           "uid":"google:101057261296257366646",
           "google":{
               "id":"101057261296257366646",
               "accessToken":"ya29.RwJdbjoUQcUYnK1Q47kfKWeQaI3PzPjJ22khRnCziNP5uo0YDR5oYSKyyuxih4xPJC0q",
               "displayName":"Matthieu Guillemette",
               "email":"matguillem37@gmail.com",
               "cachedUserProfile":{
                  "id":"101057261296257366646",
                   "email":"matguillem37@gmail.com",
                   "verified_email":true,
                   "name":"Matthieu Guillemette",
                   "given_name":"Matthieu",
                   "family_name":"Guillemette",
                   "link":"https://plus.google.com/101057261296257366646",
                   "picture":"https://lh5.googleusercontent.com/-P5f4pPq_mUw/AAAAAAAAAAI/AAAAAAAAGKs/4Xo0LqHkan4/photo.jpg",
                   "locale":"fr"
           },
           "profileImageURL":"https://lh5.googleusercontent.com/-P5f4pPq_mUw/AAAAAAAAAAI/AAAAAAAAGKs/4Xo0LqHkan4/photo.jpg"
       },
           "token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJkIjp7InVpZCI6Imdvb2dsZToxMDEwNTcyNjEyOTYyNTczNjY2NDYiLCJwcm92aWRlciI6Imdvb2dsZSJ9LCJpYXQiOjE0NDk4MzA5NDh9.MrQcVmJ1WJ9W16J5_x3XEYUxS4KKqSVDQGgVtp7pRBg",
           "auth":{
           "uid":"google:101057261296257366646",
               "provider":"google"
       },
           "expires":1449917348
       }*/
      addUser: function (authData) {

        var deferred = $q.defer();

        var userRef = ref.child('users').child(authData.uid);
        var user = $firebaseObject(userRef);

        user.$loaded()
          .then(function () {
            if (user.email) {
              deferred.resolve(user);
            } else {
              user.uid = authData.uid;
              user.email = authData.google.cachedUserProfile.email;
              user.fullname = authData.google.cachedUserProfile.name;
              user.firstname = authData.google.cachedUserProfile.given_name;
              user.lastname = authData.google.cachedUserProfile.family_name;
              user.picture = authData.google.cachedUserProfile.picture;
              user.$save()
                .then(function () {
                  deferred.resolve(user);
                });
            }
          }).catch(function (error) {
            deferred.reject(error);
          });
        return deferred.promise;
      },

      addUserEmail : function(userRef) {
        var deferred = $q.defer();

        var userEmailRef = ref.child('usersEmail').child(EscapeUtils.escapeEmail(userRef.email));
        var userEmail = $firebaseObject(userEmailRef);

        userEmail.$loaded()
          .then(function () {
            if (userEmail.$value) {
              deferred.resolve(userEmail);
            } else {
              userEmail.$value = userRef.uid;
              userEmail.$save()
                .then(function () {
                  deferred.resolve(userEmail);
                });
            }
          }).catch(function (error) {
            deferred.reject(error);
          });
        return deferred.promise;
      },

      getUsersEmail :  function(idUserConnected) {
        var deferred = $q.defer();

        var usersEmailRef = ref.child('usersEmail');
        var usersEmail = $firebaseArray(usersEmailRef);
        usersEmail.$loaded()
          .then(function () {
            var users = [];
            if (usersEmail.length>0) {
              usersEmail.forEach(function(user) {
                //l'utilisateur connecté n'est pas ajouté à la liste
                if (user.$value !== idUserConnected) {
                  users.push({uid: user.$value, email: EscapeUtils.unescapeEmail(user.$id)});
                }
              })
            }
            deferred.resolve(users);
          }).catch(function (error) {
            deferred.reject(error);
          });

        return deferred.promise;

      },

      getUser: function (username) {

        var userRef = ref.child('users').child(username);
        var user = $firebaseObject(userRef);

        return user.$loaded();
      },

      getUserFullname: function (userIndex) {

        var deferred = $q.defer();
        var userRef = ref.child('users').child(userIndex.$id).child('fullname');

        var user = $firebaseObject(userRef);

        user.$loaded()
          .then(function () {
            deferred.resolve(user.$value);
          }).catch(function (error) {
            deferred.reject(error);
          });
        return deferred.promise;
      },

      /**
       *
       * @param userIndex Utiliosateur connecté
       * @param cercleName
       * @returns {*|a}
       */
      removeCercle: function (username, cercleName) {

        var deferred = $q.defer();

        var userCercleMemberRef = ref.child('users').child(username).child('cercles').child(cercleName);
        var user = $firebaseObject(userCercleMemberRef);
        //return promise
        user.$remove()
          .then(function () {
            deferred.resolve("OK");
          })
          .catch(function (error) {
            deferred.reject(error);
          })

        return deferred.promise;
      },

      /**
       * Création association utilisateur -> cercles
       * @param userIndex Utilisateur connecté
       * @param cercleName nom du cercle à ajouter
       */
      addCercle: function (username, cerclename) {

        var deferred = $q.defer();

        var userCercleMemberRef = ref.child('users').child(username).child('cercles').child(cerclename);
        var userCercles = $firebaseObject(userCercleMemberRef);
        userCercles.$loaded()
          .then(function () {
            userCercles.$value = true;
            userCercles.$save().then(function (ref) {
              deferred.resolve(ref.key());
            })
          }).catch(function (error) {
            deferred.reject(error);
          });

        return deferred.promise;
      },

      findCerclesByUser: function (username) {
        var deferred = $q.defer();

        var userCerclesRef = ref.child('users').child(username).child('cercles');
        var userCercles = $firebaseArray(userCerclesRef);
        userCercles.$loaded()
          .then(function () {
            deferred.resolve(userCercles);
          }).catch(function (error) {
            deferred.reject(error);
          });

        return deferred.promise;

      },

      findInvitationsByUser: function (username) {

        var deferred = $q.defer();

        var usersInvitationRef = ref.child('usersInvitation').child(username);
        var userInvitations = $firebaseArray(usersInvitationRef);
        userInvitations.$loaded()
          .then(function () {
            deferred.resolve(userInvitations);
          }).catch(function (error) {
            deferred.reject(error);
          });

        return deferred.promise;
      },

      inviter: function (username, cerclename) {

        var deferred = $q.defer();

        var usersInvitationRef = ref.child('usersInvitation').child(username).child(cerclename);
        var userInvitation = $firebaseObject(usersInvitationRef);
        userInvitation.$loaded()
          .then(function () {
            userInvitation.$value = true;
            userInvitation.$save()
              .then(function () {
                deferred.resolve(username);
              })
          }).catch(function (error) {
            deferred.reject(error);
          });

        return deferred.promise;

      },

      removeInvitation: function (username, cerclename) {

        var deferred = $q.defer();

        var usersInvitationRef = ref.child('usersInvitation').child(username).child(cerclename);
        var userInvitation = $firebaseObject(usersInvitationRef);
        userInvitation.$loaded()
          .then(function () {
            userInvitation.$remove()
              .then(function () {
                deferred.resolve(username);
              })
          }).catch(function (error) {
            deferred.reject(error);
          });

        return deferred.promise;

      }
    }
  }
})()
