(function(){
    'use strict';

    angular.module('el1.services.commun',[ 'el1.model' ] );

    angular.module('el1.services.commun')
        .service('AuthService', ['$q', '$http', 'UserModel', 'Env', '$firebaseObject', AuthService]);

    /**
     *
     */
    function AuthService($q, $http, UserModel, Env, $firebaseObject) {

        return {
            user: function (nom, prenom) {
                var deferred = $q.defer();
                var refIndex = new Firebase("https://challenge-elink.firebaseio.com/index-personnes/" + nom + "/" + prenom);
                
                var userIndex = $firebaseObject(refIndex);
                userIndex.$loaded().then(
                    function () {
                        console.log("user" + userIndex.$value);
                        var ref = new Firebase("https://challenge-elink.firebaseio.com/personnes/" + userIndex.$value);
                        ref.on("value", function(snapshot) {
                              console.log(snapshot.val());
                            }, function (errorObject) {
                                  console.log("The read failed: " + errorObject.code);
                                });


                        /*var user = $firebaseObject(ref);
                        user.$loaded().then(
                            function () {
                                deferred.resolve(user);
                            }
                            );*/
                        
                    }).catch(function(error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            },
            login : function(credentials) {
                var _this= this;
                var deferred = $q.defer();

                var data = 'j_username=' + encodeURIComponent(credentials.username) +
                    '&j_password=' + encodeURIComponent(credentials.password) +
                    '&remember-me=' + credentials.rememberMe;

                $http.post(Env.backend() +  '/login', data, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF8'
                    }
                }).then(function (response) {

                    _this.getRoles().then( function (userModel) {
                        deferred.resolve(userModel);
                    }, function (erreur) {
                        deferred.reject(erreur);
                    } );

                }, function (erreur) {
                    deferred.reject(erreur);
                });

                return deferred.promise;
            },
            logout : function () {
                var _this= this;
                var deferred = $q.defer();

                $http.post(Env.backend() + '/logout', {}).then(function(response) {
                    Env.setUser(undefined);
                    _this.refreshToken().then(function(data) {
                        deferred.resolve(data);
                    }, function (erreur) {
                        deferred.reject(erreur);
                    });

                }, function (erreur) {
                        deferred.reject(erreur);
                });

                return deferred.promise;
            },
            getRoles : function () {
                var deferred = $q.defer();

                $http.get(Env.backend() + '/user').then(function(rolesResponse) {
                    var userModel= new UserModel(rolesResponse.data);
                    Env.setUser(userModel);
                    deferred.resolve(userModel);
                }, function (erreur) {
                    deferred.reject(erreur);
                });

                return deferred.promise;
            },
            refreshToken : function () {
                var deferred = $q.defer();

                $http.get(Env.backend() + '/token').success(function(data) {
                    deferred.resolve(data);
                }, function (erreur) {
                    deferred.reject(erreur);
                });

                return deferred.promise;
            },
            isInRole : function (role) {
                if (Env.getUser()) {
                    var roles= Env.getUser().roles;
                    return roles && roles.indexOf(role) !== -1;
                }
                return false;
            }
        };

    }

})();
