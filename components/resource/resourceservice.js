ResourceService = (function(angular, app) {
    return app.service("ResourceService", ["$rootScope", "$http", function ($rootScope, $http) {
        var self = this;

        var config = {};
        var resources = {};
        var state = {
            lang : "",
        };

        self.load = function () {
            self.loadSiteConfig().then(function(){
                self.loadResLanguage();
            });
        }

        self.loadSiteConfig = function () {
            return $http({
                method: "get",
                url: "/config.json",
                headers: {"Content-Type": "application/vnd.api+json"}
            }).then(function(response) {
                if (!response || !response.data) {
                    console.log("ERROR_COMMUNICATION");
                } else {
                    config = response.data;
                    $rootScope.$broadcast("config", config);
                }
            });
        }

        self.loadResLanguage = function (lang) {
            lang = lang || state.lang || "en";
            var langfile = "/resources/common-" + lang + ".json";

            if(resources[langfile])
                return resources[langfile];

            return $http({
                method: "get",
                url: langfile,
                headers: {"Content-Type": "application/vnd.api+json"}
            }).then(function(response) {
                if (!response || !response.data) {
                    console.log("ERROR_COMMUNICATION");
                } else {
                    resources[langfile] = response.data;
                    state.common = resources[langfile];
                    $rootScope.$broadcast("common", state.common);
                }
            });
        }

        self.changeLanguage = function (lang) {
            if(!config || !config.languages)
                return false;
            if(!lang || config.languages.indexOf(lang) < 0)
                return false;

            state.lang = lang;
            $rootScope.$broadcast("lang", lang);

            self.loadResLanguage();
            return true;
        }

        self.text = function (key) {
            return state.common && state.common[key] || key;
        }

        self.config = function (key) {
            if(!config)
                return;

            return config[key];
        }
    }]);
})(angular, app);