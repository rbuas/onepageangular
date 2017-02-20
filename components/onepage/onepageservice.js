OnePageService = (function(angular, jsext, app) {
    return app.service("OnePageService", ["$rootScope", "$http", "$cookies", "$window", "$interval", function ($rootScope, $http, $cookies, $window, $interval) {
        var self = this;

        var state = {};

        self.connect = function () {
        }

        self.deconnect = function() {
        }
    }]);
})(angular, jsext, app);