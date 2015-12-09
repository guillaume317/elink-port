(function(){
    'use strict';

    angular.module('el1.services.commun')
        .service('GestionService', ['$q', '$http', 'CercleModel', 'PersonnesModel', 'commonsService', 'Env', GestionService]);

    /**
     *
     */
    function GestionService($q, $http, CercleModel, PersonnesModel, commonsService, Env){

        return {
            createCercle : function (aCercleModel) {
            },
            accepterInvitation : function(invitation) {

            },
            inviter : function (invitation) {

            },
            findPersonnesByCercle : function (cercle) {
                if ( Env.isMock() ) {
                    var pers1 = {"id": "4", "nom": "Chombier", "prenom" : "Arthur" };
                    var pers2 = {"id": "5", "nom": "Dupont" , "prenom" : "Arthur" };
                    var array = [];

                    array.push(pers1);
                    array.push(pers2);

                    return new PersonnesModel(array);
                }
            },
            findInvitationsByUser : function (user) {
                if ( Env.isMock() ) {
                    var inv1 = {"id": "4", "cercle": "CCMT" };
                    var inv2 = {"id": "5", "cercle": "AngularJS" };
                    var array = [];

                    array.push(inv1);
                    array.push(inv2);

                    return array;
                }
            }
        };

    }

})();
