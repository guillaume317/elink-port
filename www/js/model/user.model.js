
angular.module('el1.model', []);

angular.module('el1.model')

    .factory('UserModel', function () {
        // constructor
        function UserModel(data) {
            angular.copy(data, this);
        }

        return UserModel;

    })

;
