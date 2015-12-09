angular.module('el1.model')

    .factory('PersonneModel', function () {
        // constructor
        function PersonneModel(data) {
            angular.copy(data, this);
            this.toString = function toString() {
                return " " + this.email + " " + this.nom + " " + this.prenom +  " ";
            }
        }
        return PersonneModel;
    })

    .factory('PersonnesModel', [ 'PersonneModel', function (PersonneModel) {
        // constructor
        function PersonnesModel(data) {
            this.items = new Array(data.length);
            for (var i in data) {
                this.items[i] = new PersonneModel(data[i]);
            }
        }

        return PersonnesModel;
    }]);