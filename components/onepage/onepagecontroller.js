OnePageController = (function(angular, app) {
    return app.controller("OnePageController", ["$scope", "$http", "$location", "$interval", "$window", "OnePageService", "ResourceService", function ($scope, $http, $location, $interval, $window, OnePageService, ResourceService) {
        var opc = $scope;
        opc.messageError = "";
        opc.menu = null;
        opc.status = "WAITING";
        
        opc.i = function (key) {
            return ResourceService.text(key);
        }

        opc.config = function (key) {
            return ResourceService.config(key);
        }

        opc.changeLanguage = function (lang) {
            if(!lang)
                return;

            ResourceService.changeLanguage(lang);
        }

        opc.updateLanguage = function(e, lang) {
            opc.lang = lang;
        }

        opc.updateCommon = function(e, common) {
            opc.status = common != null ? "READY" : "ERROR";
        }

        opc.updateConfig = function(e, config) {
            opc.menu = config && config.menu;
        }

        opc.ready = function() {
            return opc.status == "READY";
        }

        // listeners 
        opc.$on("lang", opc.updateLanguage );
        opc.$on("common", opc.updateCommon );
        opc.$on("config", opc.updateConfig );

        $window.addEventListener("beforeunload", function() { 
            return OnePageService.deconnect(); 
        });

        ResourceService.load();
        OnePageService.connect();
    }]);
})(angular, app);