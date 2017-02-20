MenuBar = (function(angular, app) {
    return app.directive("menuBar", function () {
        return {
            restrict : "AE",
            templateUrl : "/components/ui/menubar.html"
        }
    });
})(angular, app);