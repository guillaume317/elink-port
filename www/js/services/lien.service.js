(function(){
  'use strict';

  angular.module('el1.services.commun')
    .service('LiensService', ['$log', '$q', '$http', 'FBURL', '$firebaseArray', '$firebaseObject', 'Env', LiensService]);

  /**
   *
   */
  function LiensService($log, $q, $http, FBURL, $firebaseArray, $firebaseObject, Env){

    var ref = new Firebase(FBURL);

    return {

      findLinkScreen : function(lien) {
        var deferred = $q.defer();
        // le screenschot est enregistre au moment de la creation du lien
        // puis on ne change pas cette clef, même si le lien se déplace (lu/nonLu) ou se duplique (partage)
        // dans ces derniers cas, l'id original du lien est stocké dans keyOri
        // afin de retrouver la clef du screenshot
        var screenKey= lien.$id;
        if (lien.keyOri) {
          screenKey= lien.keyOri;
        }

        var linkScreens = ref.child('linkScreens').child(screenKey);
        linkScreens.once('value', function(snap) {
          var payload = snap.val();
          if (payload != null) {
            deferred.resolve(payload);
          } else {
            $log.info("image introuvable")
            deferred.resolve(undefined);
          }
        });

        return deferred.promise;
      },

      screenshotAndStore : function (lien) {

        var deferred = $q.defer();
        var _that = this;
        var config={};
        config.headers = config.headers || {};
        config.headers.Accept = 'application/json';

        $http.get('https://www.googleapis.com/pagespeedonline/v1/runPagespeed?url=' + lien.url + '&screenshot=true', config)
          .then(
          function(response) {
            var data= response.data;
            _that.addLinkScreen(lien.$id, data)
              .then(function(linkScreen) {
                deferred.resolve(linkScreen);
              })
              .catch (function(error) {
              deferred.reject(error);
            })
          },
          function(error) {
            deferred.reject(error);
          }
        );

        return deferred.promise;

      },

      addLinkScreen: function(linkId, dataScreen){
        var deferred = $q.defer();

        var linkScreenRef = ref.child('linkScreens').child(linkId);
        var linkScreen = $firebaseObject(linkScreenRef);
        linkScreen.$loaded()
          .then(function () {
            linkScreen.$value = dataScreen.screenshot.data.replace(/_/g, '/').replace(/-/g, '+');
            linkScreen.$save();
            deferred.resolve(linkScreen);
          }).catch(function (error) {
            deferred.reject(error);
          });

        return deferred.promise;
      },

      deleteLinkScreen: function(link){
        var linkScreenId;
        // on ne supprime pas l'image si c'est un clone
        // car les images ne sont pas dupliquées
        if (link.clone)
          return;

        if (link.keyOri)
          linkScreenId= link.keyOri;
        else
          linkScreenId= link.$id;

        if (linkScreenId) {
          var linkScreenRef = ref.child('linkScreens').child(linkScreenId);
          if (linkScreenRef)
            linkScreenRef.remove();
        }
      },

      createLinkForUser : function(lien, username) {
        var deferred = $q.defer();

        var userLinksRef;
        if (lien.private==="biblio") {
          userLinksRef = ref.child('usersLinks').child(username).child('read');
        } else {
          userLinksRef = ref.child('usersLinks').child(username).child('notread');
        }
        var userLinks = $firebaseArray(userLinksRef);
        userLinks.$loaded()
          .then(function () {
            var newLink = {};
            newLink.createdOn = Firebase.ServerValue.TIMESTAMP;
            newLink.title = lien.title ? lien.title : lien.url.substring(0, 100);
            newLink.url = lien.url;
            newLink.teasing = "";

            if (lien.keyOri) {
              newLink.keyOri = lien.keyOri;
              newLink.clone= "true";
            } else if (lien.$id) {
              newLink.keyOri = lien.$id;
              newLink.clone= "true";
            }

            userLinks.$add(newLink)
              .then(function (linkAdded) {
                newLink.$id= linkAdded.key();
                deferred.resolve(newLink);
              });

          }).catch(function (error) {
            deferred.reject(error);
          });

        return deferred.promise;
      },

      findNotReadLinksByUser : function(username) {
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

      findReadLinksByUser : function(username) {
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
      findLinksByCerlceName : function(cercleName) {

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

      findLinksByCerlceNameAndIdLink : function(cercleName, idLink) {

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

      addLike : function(cercleName, lien, liens) {
        var deferred = $q.defer();
        var idLink= lien.$id;

        // a noter : idLink format K4cGFb8ts5teWMJq4PC
        // Pour le cercle CCMT, on obtient l'identifiant CCMT-K4cGFb8ts5teWMJq4PC
        // Le nom du cercle est nécessaire pour récupérer le détail de l'article par la suite
        var cercleLinkLikeRef = ref.child('cercleLinksLike').child(cercleName + idLink);
        var cercleLinkLike = $firebaseObject(cercleLinkLikeRef);
        cercleLinkLike.$loaded()
          .then(function () {
            var like= cercleLinkLike.$value === null ? 1 : cercleLinkLike.$value + 1;
            cercleLinkLike.$value = like;
            cercleLinkLike.$save();
            lien.like= like;
            liens.$save(lien).then(function () {
              deferred.resolve(cercleLinkLike);
            }).catch(function (error) {
              deferred.reject(error);
            });
          }).catch(function (error) {
            deferred.reject(error);
          });

        return deferred.promise;
      },

      findTopTenLinks : function() {

        var deferred = $q.defer();
        var _that = this;

        var likeRef =  new Firebase(FBURL + 'cercleLinksLike');

        //A noter : le tri est ascendant. On prend donc les 10 derniers
        likeRef.orderByValue().limitToLast(10).on("value", function(snapshot) {

          var topTen = [];

          snapshot.forEach(function(data) {

            // key[0] : nom du cercle
            // key[1] : identifiant de l'article
            // BUG : identifiant de l'article peut contenir un '-'
            var key = data.key();
            var cptLike = data.val();

            var index= key.indexOf("-");
            var cercleId= key.substring(0, index);
            var linkId= key.substring(index);

            //jointure avec le lien pour récupérer sa description
            _that.findLinksByCerlceNameAndIdLink(cercleId, linkId)
              .then(function(aLink){
                topTen.push(angular.extend({},
                  {
                    link: aLink,
                    cpt: cptLike,
                    cercleName: cercleId
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
        // features/feature-01-oauth
        var deferred = $q.defer();

        var ref = new Firebase(Env.backendfirebase() + "categories");
        var categories = $firebaseArray(ref);

        categories.$loaded().then(
          function() {
            //obtention d'un tableau d'objet
            // [Object
            //      $id: "0"
            //      $priority: null
            //      $value: "devops"
            //On itere sur ce dernier pour recuperer la liste
            var array = [];
            categories.forEach(function(obj) {
              array.push(obj.$value);
            })
            deferred.resolve(array);
          }).catch(function(error) {
            deferred.reject(error);
          });

        return deferred.promise;
      },
      /* toutes les cercles auquels le user appaertient */
      findMyCercles: function () {
        // features/feature-01-oauth
        var deferred = $q.defer();

        var ref = new Firebase(Env.backendfirebase() + "cercles");
        var cercles = $firebaseArray(ref);
        cercles.$loaded().then(
          function() {
            //obtention d'un tableau d'objet
            // [Object
            //      $id: "CCMT"
            //On itere sur ce dernier pour recuperer la liste
            var array = [];
            cercles.forEach(function(obj) {
              array.push(obj.$id);
            })
            deferred.resolve(array);
          }).catch(function(error) {
            deferred.reject(error);
          });

        return deferred.promise;
      }

    };

  }

})();
