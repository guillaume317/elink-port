(function(){
    'use strict';

    angular.module('el1.services.commun',[ 'el1.model' ] );

    angular.module('el1.services.commun')
        .service('AuthService', ['FBURL', AuthService]);

    /**
     *
     */
    function AuthService(FBURL){

        return {

            logout : function () {
                var ref = new Firebase(FBURL);
                ref.unauth();
                return;
            }
        };

    }

})();
