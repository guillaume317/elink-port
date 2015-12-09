angular.module('el1.model')

    .factory('LienModel', function () {
        // constructor
        function LienModel(data) {
            angular.copy(data, this); 
            this.toString = function toString() {
                return " " + this.lu + " " + this.private + " " + this.url +  " ";
            }
        }
        return LienModel;
    })

    .factory('LiensModel', [ 'LienModel', function (LienModel) {
        // constructor
        function LiensModel(data) {
            this.items = new Array(data.length);
            for (var i in data) {
                this.items[i] = new LienModel(data[i]);
            }
        }

        return LiensModel;
    }]);
