(function () {
  'use strict';

  angular.module('el1.services.commun')
    .service('LiensService', ['$q', 'FBURL', '$firebaseArray', '$firebaseObject', 'Env', LiensService]);

  /**
   *
   */
  function LiensService($q, FBURL, $firebaseArray, $firebaseObject, Env) {

    var ref = new Firebase(FBURL);

    return {

      createLinkForUser: function (lien, username) {
        var deferred = $q.defer();

        var userLinksRef;
        if (lien.private === "biblio") {
          userLinksRef = ref.child('usersLinks').child(username).child('read');
        } else {
          userLinksRef = ref.child('usersLinks').child(username).child('notread');
        }
        var userLinks = $firebaseArray(userLinksRef);
        userLinks.$loaded()
          .then(function () {
            var newLink = {};
            newLink.createdOn = Firebase.ServerValue.TIMESTAMP;
            newLink.title = lien.title ? lien.title : "Titre à récupérer";
            newLink.teasing = lien.teasing ? lien.teasing : "Teasing à récupérer !";
            newLink.url = lien.url;
            userLinks.$add(newLink);
            deferred.resolve(newLink);
          }).catch(function (error) {
            deferred.reject(error);
          });

        return deferred.promise;
      },

      findNotReadLinksByUser: function (username) {
        var deferred = $q.defer();

        var userLinksNotReadRef = ref.child('usersLinks').child(username).child('notread');
        var userLinksNotRead = $firebaseArray(userLinksNotReadRef);
        userLinksNotRead.$loaded()
          .then(function () {
            deferred.resolve(userLinksNotRead);
          }).catch(function (error) {
            deferred.reject(error);
          });

        return deferred.promise;
      },

      findReadLinksByUser: function (username) {
        var deferred = $q.defer();

        var userLinksReadRef = ref.child('usersLinks').child(username).child('read');
        var userLinksRead = $firebaseArray(userLinksReadRef);
        userLinksRead.$loaded()
          .then(function () {
            deferred.resolve(userLinksRead);
          }).catch(function (error) {

            deferred.reject(error);
          });

        return deferred.promise;
      },

      /**
       * Recherche des liens d'un cercle appartenant à un utilisateur
       * La liste des cercles d'un utilisateur doit être connue avant
       * @param cercleName
       * @returns {*}
       */
      findLinksByCerlceName: function (cercleName) {

        var deferred = $q.defer();

        var cercleLinksRef = ref.child('cercleLinks').child(cercleName);
        var cercleLinks = $firebaseArray(cercleLinksRef);
        cercleLinks.$loaded()
          .then(function () {
            deferred.resolve(cercleLinks);
          }).catch(function (error) {
            deferred.reject(error);
          });

        return deferred.promise;

      },

      findLinksByCerlceNameAndIdLink: function (cercleName, idLink) {

        var deferred = $q.defer();

        var cercleLinkRef = ref.child('cercleLinks').child(cercleName).child(idLink);
        var cercleLink = $firebaseObject(cercleLinkRef);
        cercleLink.$loaded()
          .then(function () {
            deferred.resolve(cercleLink);
          }).catch(function (error) {
            deferred.reject(error);
          });

        return deferred.promise;

      },

      addLike: function (cercleName, idLink) {


        var deferred = $q.defer();

        // a noter : idLink format K4cGFb8ts5teWMJq4PC
        // Pour le cercle CCMT, on obtient l'identifiant CCMT-K4cGFb8ts5teWMJq4PC
        // Le nom du cercle est nécessaire pour récupérer le détail de l'article par la suite
        var cercleLinkLikeRef = ref.child('cercleLinksLike').child(cercleName + idLink);
        var cercleLinkLike = $firebaseObject(cercleLinkLikeRef);
        cercleLinkLike.$loaded()
          .then(function () {
            cercleLinkLike.$value = cercleLinkLike.$value === null ? 1 : cercleLinkLike.$value + 1;
            cercleLinkLike.$save();
            deferred.resolve(cercleLinkLike);
          }).catch(function (error) {
            deferred.reject(error);
          });

        return deferred.promise;
      },

      findTopTenLinks: function () {

        var deferred = $q.defer();
        var _that = this;

        var likeRef = new Firebase(FBURL + 'cercleLinksLike');

        //A noter : le tri est ascendant. On prend donc les 10 derniers
        likeRef.orderByValue().limitToLast(10).on("value", function (snapshot) {

          var topTen = [];

          // key[0] : nom du cercle
          // key[1] : identifiant de l'article'
          snapshot.forEach(function (data) {

            // key[0] : nom du cercle
            // key[1] : identifiant de l'article
            var key = data.key();
            var keyValue = key.split('-');
            var cptLike = data.val();

            //jointure avec le lien pour récupérer sa description
            _that.findLinksByCerlceNameAndIdLink(keyValue[0], '-' + keyValue[1])
              .then(function (aLink) {
                topTen.push(angular.extend({},
                  {
                    link: aLink,
                    cpt: cptLike,
                    cercleName: keyValue[0]
                  }
                ));
              })


          });

          deferred.resolve(topTen);
        });

        return deferred.promise;

      },

      /* toutes les catgories */
      findCategories: function () {
        if (Env.isMock()) {

          /**var array = ['devops', 'java', 'veille', 'divers'];
           return array;*/
          // features/feature-01-oauth
          var deferred = $q.defer();

          //TODO Once() function
          var ref = new Firebase(Env.backendfirebase() + "categories");
          var categories = $firebaseArray(ref);

          categories.$loaded().then(
            function () {
              //obtention d'un tableau d'objet
              // [Object
              //      $id: "0"
              //      $priority: null
              //      $value: "devops"
              //On it�re sur ce dernier pour r�cup�rer la liste
              var array = [];
              categories.forEach(function (obj) {
                array.push(obj.$value);
              })
              deferred.resolve(array);
            }).catch(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        }

      },
      /* toutes les cercles auquels le user appaertient */
      findMyCercles: function () {
        if (Env.isMock()) {

          /**
           var array = ['CCMT', 'DevOps'];
           return array;*/
          // features/feature-01-oauth
          var deferred = $q.defer();

          var ref = new Firebase(Env.backendfirebase() + "cercles");
          var cercles = $firebaseArray(ref);
          cercles.$loaded().then(
            function () {
              //obtention d'un tableau d'objet
              // [Object
              //      $id: "CCMT"
              //On it�re sur ce dernier pour r�cup�rer la liste
              var array = [];
              cercles.forEach(function (obj) {
                array.push(obj.$id);
              })
              deferred.resolve(array);
            }).catch(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        }

      }

    };

  }

})();
