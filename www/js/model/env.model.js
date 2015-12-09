'use strict';
angular.module('el1.model')

    .factory('Env', function Env() {
        var _backend, _user, _backendfirebase;

        return {
            init: function (data) {
                _backend = data.backend;
                _backendfirebase = data.backendfirebase;
            },
            backend: function() {
                return _backend;
            },
            backendfirebase : function() {
                return _backendfirebase;
            },
            setUser: function(user) {
                _user= user;
            },
            getUser: function() {
                return _user;
            },
            isAuthenticated: function () {
                return _user !== null;
            },
            isAdmin: function () {
                return _user !== null && _user.admin;
            },
            isMock: function() {
                return true;
            }
        };

    })

;