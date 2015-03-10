var app = angular.module('app', ['firebase', 'ngRoute']);

// Beofre you get started, enter the name of a valid Firebase.
// Ie you need one, sign up for a free account at http://bit.ly/firebase-egghead
app.constant('FIREBASE_URI', 'https://TUFIRE.firebaseio.com/');


app.config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider) {
    $routeProvider.when('/login', {
        controller: 'LoginCtrl',
        templateUrl: 'login.html'
    })
    .when('/admin', {
        controller: 'MainCtrl',
        templateUrl: 'admin.html'
    })
     
    .otherwise({ redirectTo: '/login' });

      
}]);



app.controller('MainCtrl', ['$scope', 'ItemsService', function ($scope, ItemsService) {
    $scope.newItem = { titulo: '', contenido: '', portada: '', imagen1: '', imagen2: '', imagen3: '', imagen4: '' };
    $scope.currentItem = null;

    $scope.items = ItemsService.getItems();

    $scope.addItem = function () {
        ItemsService.addItem(angular.copy($scope.newItem));
        $scope.newItem = { name: '', description: '', count: 0 };
    };

    $scope.updateItem = function (id) {
        ItemsService.updateItem(id);
    };

    $scope.removeItem = function (id) {
        ItemsService.removeItem(id);
    };
}]);

app.factory('ItemsService', ['$firebase', 'FIREBASE_URI', function ($firebase, FIREBASE_URI) {
    var ref = new Firebase(FIREBASE_URI);
    var items = $firebase(ref);

    var getItems = function () {
        return items;
    };

    var addItem = function (item) {
        items.$add(item);
    };

    var updateItem = function (id) {
        items.$save(id);
    };

    var removeItem = function (id) {
        items.$remove(id);
    };

    return {
        getItems: getItems,
        addItem: addItem,
        updateItem: updateItem,
        removeItem: removeItem
    }
}]);


app.controller('LoginCtrl', function ($scope, $firebaseSimpleLogin, FIREBASE_URI, $rootScope, $location) {
    $scope.loginService = $firebaseSimpleLogin(new Firebase(FIREBASE_URI));
    $scope.newUser = { email: '', password: '' };
    $scope.currentUser  = null;

    $scope.login = function (email, password) {
        $scope.loginService.$login('password', {email:email, password:password})
            .then(function(user){
               $scope.currentUser = user;
                $rootScope.currentUser = user;
                $location.path( "/admin" );
            });
    };

    $scope.register = function (email, password) {
        $scope.loginService.$createUser(email, password)
            .then(function(user){
                $scope.currentUser = user;
                $scope.resetForm();
            });
    };

    $scope.resetForm = function () {
        $scope.newUser = { email: '', password: '' };
    };
});

app.run( function($rootScope, $location) {

    // register listener to watch route changes
    $rootScope.$on( "$locationChangeStart", function(event, next, current) {
      if ( $rootScope.currentUser == null ) {
        // no logged user, we should be going to #login
        if ( next.templateUrl == "/login" ) {
          // already going to #login, no redirect needed
        } else {
          // not going to #login, we should redirect now
          $location.path( "/login" );
        }
      }         
    });
 })



