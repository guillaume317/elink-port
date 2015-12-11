/**
 * Created by Guillemette on 08/12/2015.
 */
(function() {
    'use strict';

    angular.module('el1.services.commun')
        .service('UsersManager', ['$firebaseObject', '$firebaseArray', '$q', 'Env', UsersManager]);

    function UsersManager ($firebaseObject, $firebaseArray, $q, Env) {

        var ref = new Firebase("https://elink.firebaseio.com/");

            return {

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
                        .then(function() {
                            deferred.resolve("OK");
                        })
                        .catch(function(error){
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
                            userCercles.$value=true;
                            userCercles.$save().then(function(){
                                deferred.resolve(cerclename);
                            })
                        }).catch(function (error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                },

                findCerclesByUser : function(username) {
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

                findInvitationsByUser: function(username) {

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

                inviter : function(username, cerclename) {

                    var deferred = $q.defer();

                    var usersInvitationRef = ref.child('usersInvitation').child(username).child(cerclename);
                    var userInvitation = $firebaseObject(usersInvitationRef);
                    userInvitation.$loaded()
                        .then(function () {
                            userInvitation.$value=true;
                            userInvitation.$save()
                                .then(function() {
                                    deferred.resolve(username);
                                })
                        }).catch(function (error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;

                },

                removeInvitation : function(username, cerclename) {

                    var deferred = $q.defer();

                    var usersInvitationRef = ref.child('usersInvitation').child(username).child(cerclename);
                    var userInvitation = $firebaseObject(usersInvitationRef);
                    userInvitation.$loaded()
                        .then(function () {
                            userInvitation.$remove()
                                .then(function(){
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