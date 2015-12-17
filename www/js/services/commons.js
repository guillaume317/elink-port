(function(){
    'use strict';

    angular.module('el1.services.commun')
        .service('commonsService', ['$q', '$http', CommonsService])
        .service('EscapeUtils', EscapeUtils)
        .factory('FBFactory', ['$firebaseAuth', '$firebaseArray', 'FBURL', FBFactory])
        .factory('LocalStorage', [LocalStorage])
        .factory('SessionStorage', [SessionStorage]);

    function EscapeUtils() {

      this.escapeEmail = function (email) {
        return (email || '').replace('.', ',');
      }

      this.unescapeEmail = function (email) {
        return (email || '').replace(',', '.');
      }
    }

    /**
     *
     */
    function CommonsService($q, $http){

        return {
            flatModel : function(aModel) {
                var result = "";
                var index= 0;
                for (var prop in aModel) {

                    if(typeof aModel[prop] != "function" && typeof aModel[prop] != "object"){
                        if (aModel[prop] != undefined) {
                            if (index != 0)
                                result = result + "|";
                            result = result + prop + "::" + aModel[prop];
                            index= index + 1;
                        }
                    }

                }// for

                return result;
            }, // flatModel

            isUrlValid : function(url) {
              return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
            }

        };

    }

  function FBFactory ($firebaseAuth, $firebaseArray, FBURL) {

    return {
      auth: function() {
        var FBRef = new Firebase(FBURL);
        return $firebaseAuth(FBRef);
      }
    };
  }

  function LocalStorage() {

    return {

      set: function(key, value) {
        return localStorage.setItem(key,
          JSON.stringify(value));
      },
      get: function(key) {
        return JSON.parse(localStorage.getItem(key));
      },
      remove: function(key) {
        return localStorage.removeItem(key);
      }
    };
  }

  function SessionStorage() {

    return {

      set: function(key, value) {
        return sessionStorage.setItem(key,
          JSON.stringify(value));
      },
      get: function(key) {
        return JSON.parse(sessionStorage.getItem(key));
      },
      remove: function(key) {
        return sessionStorage.removeItem(key);
      }
    };
  }

})();


Date.prototype.formatDate = function (format) {
    var date = this,
        day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear(),
        hours = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds();

    if (!format) {
        format = "MM/dd/yyyy";
    }

    format = format.replace("MM", month.toString().replace(/^(\d)$/, '0$1'));

    if (format.indexOf("yyyy") > -1) {
        format = format.replace("yyyy", year.toString());
    } else if (format.indexOf("yy") > -1) {
        format = format.replace("yy", year.toString().substr(2, 2));
    }

    format = format.replace("dd", day.toString().replace(/^(\d)$/, '0$1'));

    if (format.indexOf("t") > -1) {
        if (hours > 11) {
            format = format.replace("t", "pm");
        } else {
            format = format.replace("t", "am");
        }
    }

    if (format.indexOf("HH") > -1) {
        format = format.replace("HH", hours.toString().replace(/^(\d)$/, '0$1'));
    }

    if (format.indexOf("hh") > -1) {
        if (hours > 12) {
            hours -= 12;
        }

        if (hours === 0) {
            hours = 12;
        }
        format = format.replace("hh", hours.toString().replace(/^(\d)$/, '0$1'));
    }

    if (format.indexOf("mm") > -1) {
        format = format.replace("mm", minutes.toString().replace(/^(\d)$/, '0$1'));
    }

    if (format.indexOf("ss") > -1) {
        format = format.replace("ss", seconds.toString().replace(/^(\d)$/, '0$1'));
    }

    return format;
};
