(function(){
    'use strict';

    angular.module('el1.services.commun')
        .service('LiensService', ['$q', '$http', 'LiensModel', 'LienModel', 'ExtractService', 'commonsService', 'Env', '$firebaseArray', '$firebaseObject', LiensService]);

    /**
     *
     */
    function LiensService($q, $http, LiensModel, LienModel, ExtractService, commonsService, Env, $firebaseArray, $firebaseObject){

        var ref = new Firebase("https://challenge-elink.firebaseio.com/");

        return {

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

                        ExtractService.extractURL(lien).then(function () {

                            newLink.title = lien.title; // "Titre à récupérer";
                            newLink.teasing = lien.teasing; //"Teasing à récupérer !";
                            newLink.url = lien.url;
                            userLinks.$add(newLink);
                            deferred.resolve(newLink);

                        }).catch(function (error) {

                                newLink.title = lien.url;
                                newLink.teasing = "";
                                newLink.url = lien.url;
                                userLinks.$add(newLink);
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

            /* Tous mes liens (read / unread) */
             findMyLinks : function(isUnread) {
               if ( Env.isMock() ) {
                   var link1 = {"id": "1", "url": "http://www.google.fr", "title" : "google", "teasing" : "le site de google"};
                   var link2 = {"id": "2", "url": "http://www.yahoo.fr", "title" : "yahoo", "teasing" : "le site de yahoo"};
                   var link3 = {"id": "3", "url": "https://material.angularjs.org/", "title" : "material", "teasing" : " material et angular"};
                   var array = [];
                   if (isUnread) {
                       array.push(link1);
                       array.push(link2);
                    } else {
                       array.push(link3);
                   }
                   return new LiensModel(array);
                }

                var url = Env.backend() + "/liens";
                return $http.get(url, {params : {expand : expand, filter : commonsService.flatModel(aLienModel), start : start, limit : limit, sortByAsc : sortByAsc} }).then(function (response) {
                    return (new LiensModel(response.data))
                }, function (erreur) {
                    throw erreur;
                });
            },
            /* Tous les liens du cercle pass� en parametre */
            findTeamLinks : function(cercle) {
                if ( Env.isMock() ) {

					/**
                    var link1 = {"id": "4", "url": "http://www.google.fr", "title" : "google", "teasing" : "A LIRE !!", "sharedBy" : "Arthur", "category" : "divers" };
                    var link2 = {"id": "5", "url": "http://www.yahoo.fr" , "title" : "yahoo", "teasing" : "A LIRE !!", "sharedBy" : "Arthur", "category" : "divers"};
                    var link3 = {"id": "6", "url": "https://material.angularjs.org/" , "title" : "material", "teasing" : "A LIRE !!", "sharedBy" : "Arthur", "category" : "veille"};
                    var array = [];

                    array.push(link1);
                    array.push(link2);
                    array.push(link3);
                    return new LiensModel(array);*/

                    // features/feature-01-oauth
                    var deferred = $q.defer();

                    var ref = new Firebase(Env.backendfirebase() + "cercles/" + cercle + "/links");
                    var links = $firebaseArray(ref);
                    links.$loaded().then(
                        function() {
                            //On it�re sur ce dernier pour r�cup�rer la liste
                            // {$id: "-K4YOLJ9dAboViEfuymG"$priority: nullcategory: "divers"id: "4"sharedBy: "Arthur"teasing: "A LIRE !!"title: "google"url: "http://www.google.fr"}
                            deferred.resolve(new LiensModel(links));
                        }).catch(function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }

                var url = Env.backend() + "/liens";
                return $http.get(url, {params : {expand : expand, filter : commonsService.flatModel(aLienModel), start : start, limit : limit, sortByAsc : sortByAsc} }).then(function (response) {
                    return (new LiensModel(response.data))
                }, function (erreur) {
                    throw erreur;
                });
            },
            /* marque le lien comme lu */
            markAsRead : function (aLienModel) {

            },
            /* marque le lien comme non lu */
            markAsUnread : function (aLienModel) {

            },
            /* toutes les catgories */
            findCategories: function () {
                if ( Env.isMock() ) {

                    /**var array = ['devops', 'java', 'veille', 'divers'];
                    return array;*/
                    // features/feature-01-oauth
                    var deferred = $q.defer();

                    //TODO Once() function
                    var ref = new Firebase(Env.backendfirebase() + "categories");
                    var categories = $firebaseArray(ref);

                    categories.$loaded().then(
                        function() {
                            //obtention d'un tableau d'objet
                            // [Object
                            //      $id: "0"
                            //      $priority: null
                            //      $value: "devops"
                            //On itère sur ce dernier pour récupérer la liste
                            var array = [];
                            categories.forEach(function(obj) {
                                array.push(obj.$value);
                            })
                            deferred.resolve(array);
                        }).catch(function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }

            },
            /* toutes les cercles auquels le user appaertient */
            findMyCercles: function () {
                if ( Env.isMock() ) {

                    var array = ['CCMT', 'DevOps'];
                    return array;
                        /*
                    // features/feature-01-oauth
                    var deferred = $q.defer();

                    var ref = new Firebase(Env.backendfirebase() + "cercles");
                    var cercles = $firebaseArray(ref);
                    cercles.$loaded().then(
                        function() {
                            //obtention d'un tableau d'objet
                            // [Object
                            //      $id: "CCMT"
                            //On it�re sur ce dernier pour r�cup�rer la liste
                            var array = [];
                            cercles.forEach(function(obj) {
                                array.push(obj.$id);
                            })
                            deferred.resolve(array);
                        }).catch(function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;*/
                }

            },
            createLien : function (aLienModel) {
                var url = Env.backend() + "/liens";
                return $http.put(url, aLienModel).then(function (response) {
                    //
                    return response.status;
                }, function (erreur) {
                    throw erreur;
                });
            },
            deleteLien : function (aLienModel) {
                var url = Env.backend() + "/liens/" + aLienModel.id;
                return $http.delete(url, {}).then(function (response) {
                    return response.status;
                }, function (erreur) {
                    throw erreur;
                });
            }

        };

    }

})();
