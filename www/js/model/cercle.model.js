angular.module('el1.model')

    .factory('CercleModel', function () {
        // constructor
        function CercleModel(data) {
            angular.copy(data, this); 
            this.toString = function toString() {
                return " " + this.label +  " ";
            }
        }
        return CercleModel;
    })

    .factory('CerclesModel', [ 'CercleModel', function (CercleModel) {
        // constructor
        function CerclesModel(data) {
            this.items = new Array(data.length);
            for (var i in data) {
                this.items[i] = new CercleModel(data[i]);
            }
        }

        return CerclesModel;
    }]);
