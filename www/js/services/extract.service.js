(function(){
    'use strict';

    angular.module('el1.services.commun')
        .service('ExtractService', ['$log', '$q', '$http', 'commonsService', 'Env', ExtractService]);

    /**
     *
     */
    function ExtractService($log, $q, $http, commonsService, Env){

        return {
            extractURL : function (aLienModel) {

                var deferred = $q.defer();

                $.get(aLienModel.url).done(function (responseHtml) {
                    var newTitle = $(responseHtml).filter('title').text();
                    var content = $(responseHtml).filter('h1, h2, h3').text();
                    content= content.substring(0, Math.min(250, content.length));
                    aLienModel.title= newTitle;
                    aLienModel.teasing= content;
                    deferred.resolve(aLienModel);
                });

                return deferred.promise;

            }
        };

    }

})();
