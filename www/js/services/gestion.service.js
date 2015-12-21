(function(){
  'use strict';

  angular.module('el1.services.commun')
    .service('GestionService', ['$q', '$firebaseObject', '$firebaseArray', 'PersonnesModel', 'FBURL', 'UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY', GestionService]);

  /**
   *
   */
  function GestionService($q, $firebaseObject, $firebaseArray, PersonnesModel, FBURL, UsersManager, SessionStorage, USERFIREBASEPROFILEKEY) {

    var ref = new Firebase(FBURL);

    function saveCercle (cercleName, cercleDescription, username) {

      var deferred = $q.defer();

      var cercleRef = ref.child('cercles').child(cercleName);
      var cercle = $firebaseObject(cercleRef);

      cercle.$loaded()
        .then(function () {
          if (cercle.$value !== null) {
            deferred.reject(new Error("le cercle existe déjà !"));
          } else {

            cercle.user = username;
            //cercle.created = new Date().getTime();
            cercle.created = Firebase.ServerValue.TIMESTAMP;
            cercle.description = cercleDescription;

            cercle.$save()
              .then(function () {
                deferred.resolve(cercle);
              })
              .catch(function (error) {
                deferred.reject(error);
              });
          }
        })
        .catch(function (error) {
          deferred.reject(error);
        });

      return deferred.promise;

    }
    function saveCercleMember (cerclename, username) {

      var deferred = $q.defer();

      var cercleMemberRef = ref.child('cercleMembers').child(cerclename).child(username);
      var cercleMember = $firebaseObject(cercleMemberRef);

      cercleMember.$loaded()
        .then(function() {
          cercleMember.$value = true;
          cercleMember.$save()
            .then(function () {
              deferred.resolve(cerclename);
            })
            .catch(function (error) {
              deferred.reject(error);
            });
        })
        .catch(function(error) {
          deferred.reject(error);
        });

      return deferred.promise;

    }

    function getCercleUsers(usersIndex) {

      var promises = [];

      angular.forEach(usersIndex,  function(userIndex, index) {
        promises.push(UsersManager.getUser(userIndex.$id));
      });

      return $q.all(promises);
    }



    return {
      createCercle : function (aCercleModel) {

        return saveCercle(aCercleModel.label, aCercleModel.description, SessionStorage.get(USERFIREBASEPROFILEKEY).uid)
          .then(function(cercle){
            return saveCercleMember (cercle.$id, SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
          })
          .then(function(cerclename){
            return UsersManager.addCercle(SessionStorage.get(USERFIREBASEPROFILEKEY).uid, cerclename)
          });

      },
      accepterInvitation : function(username, cerclename) {
        // ==> Ajout du cercle au niveau du user.
        // ==> Ajout de l'utilisateur au niveau des membres du cercle
        // ==> Suppression de l'invitation en attente
        return saveCercleMember(cerclename, username)
          .then( function(cercleName) {
            return UsersManager.addCercle(username, cerclename)
          })
          .then(function(user) {
            return UsersManager.removeInvitation(username, cerclename)
          });
      },

      findPersonnesByCercle : function (cercle) {

        var deferred = $q.defer();

        var membersRef = ref.child('cercleMembers').child(cercle.$id);
        var membersIndex = $firebaseArray(membersRef);

        membersIndex.$loaded()
          .then(function() {
            return getCercleUsers(membersIndex)
          })
          .then(function(users) {
            deferred.resolve(users);
          })
          .catch(function(error) {
            deferred.reject(error);
          });

        return deferred.promise;

      },

      shareLien : function(shareLink, userConnected) {

        var deferred = $q.defer();

        var cercleLinksRef = ref.child('cercleLinks').child(shareLink.cercleName);
        var cercleLinksIndex = $firebaseArray(cercleLinksRef);

        cercleLinksIndex.$loaded()
          .then(function() {

            var newCercle = {
              title: shareLink.title,
              teasing: shareLink.teasing,
              createdOn : Firebase.ServerValue.TIMESTAMP,
              url : shareLink.url,
              category: shareLink.category,
              sharedBy: userConnected.google.cachedUserProfile.name,
              keyOri: shareLink.keyOri
            };
            cercleLinksIndex.$add(newCercle)
              .then(function() {
                deferred.resolve(newCercle);
              })
          })
          .catch(function(error) {
            deferred.reject(error);
          });

        return deferred.promise;

      }

    };

  }

})();
