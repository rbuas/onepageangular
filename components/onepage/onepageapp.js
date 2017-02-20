app = (function(angular) {
    var app = angular.module("OnePageApp", ["ngRoute", "ngResource", "ngCookies"]);

    app.config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
        $routeProvider
            .when("/", {
                templateUrl : "views/maincontent.html"
            })
            .otherwise({redirectTo:"/"});
            //$locationProvider.html5Mode(true);
    }]);

    return app;
})(angular);