tracer = (function() {
    Tracer  = {
        LEVEL_ERROR : 'E',
        LEVEL_WARNING : 'W',
        LEVEL_MESSAGE : 'M',
        LEVEL_COMM : 'C',
        LEVEL_ALL : '*',
        LEVEL_DISABLED : 'D',

        setLevel : function (level) {
            this.level = level;
        },

        isLevelActive : function (level) {
            if(!level || !this.level)
                return false;

            if(this.level == this.LEVEL_ALL)
                return true;

            return this.level.indexOf(level) >= 0;
        },

        log : function ( level, msg, obj, force ) {
            if(!msg)
                return;

            if(!force && !this.isLevelActive(level))
                return;

            console.log(this.levelBegin(level) + msg, this.levelEnd(level), obj);
        },

        comm : function ( msg, obj, force ) {
            return this.log(this.LEVEL_COMM, msg, obj, force);
        },

        message : function ( msg, obj, force ) {
            return this.log(this.LEVEL_MESSAGE, msg, obj, force);
        },

        error : function ( error, obj, force ) {
            return this.log(this.LEVEL_ERROR, error, obj, force);
        },

        warning : function ( warning, obj, force ) {
            return this.log(this.LEVEL_WARNING, warning, obj, force);
        },

        levelBegin : function (level) {
            switch(level) {
                case(this.LEVEL_ERROR): return '%c ERROR : ';
                case(this.LEVEL_WARNING): return '%c WARNING : ';
            }
            return '';
        },

        levelEnd : function (level) {
            switch(level) {
                case(this.LEVEL_ERROR): return 'color: #ff1515;';
                case(this.LEVEL_WARNING): return 'color: #AA8E39;';
            }
            return '';
        }
    };

    Tracer.setLevel(Tracer.LEVEL_ERROR + Tracer.LEVEL_WARNING);

    return Tracer;
})();
jsext = (function () {
    jsext = {
        isNullOrUndefined : function (variable){
            return (typeof (variable) === "undefined" || variable === null)
        },

        getObjectValues : function (dataObject) {
            if (!dataObject)
                return;
            var dataArray = Object.keys(dataObject).map(function (k) { return dataObject[k] });
            return dataArray;
        },

        serializeDictionary : function (obj, connector) {
            if (!obj)
                return;

            connector = connector || ",";
            var builder = [];
            for (var i in obj) {
                if (!obj.hasOwnProperty(i) || typeof (i) === 'function') continue;

                builder.push(i + "=" + obj[i]);
            }
            return builder.join(connector);
        },

        buildUrl : function (link, params, starter) {
            var serializedParams = typeof (params) == "string" ? params : _querystring.stringify(params);
            var url = link || "";
            if (serializedParams) {
                starter = starter || "?";
                if (url.indexOf(starter) < 0) {
                    url += starter + serializedParams;
                } else {
                    url = url.endsWith("&") ? url + serializedParams : url + "&" + serializedParams;
                }
            }

            return url;
        },

        first : function (obj) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i) || typeof (i) === 'function') continue;

                return obj[i];
            }
        },

        trim : function (text) {
            return text && text.replace(/^\s+|\s+$/g, '');
        },

        escape : function (text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        },

        format : function (format, args) {
            if(!format) 
                return;

            for (var i = 0; i < args.length; i++) {
                var replacement = '{' + i + '}';
                format = format.replace(replacement, args[i]);
            }
            return format;
        },

        unique : function (arr) {
            var a = arr.concat();
            for (var i = 0; i < a.length; ++i) {
                for (var j = i + 1; j < a.length; ++j) {
                    if (a[i] === a[j])
                        a.splice(j--, 1);
                }
            }
            return a;
        },

        removeArray : function (arr, killer) {
            var a = arr.concat();
            for (var i = 0; i < killer.length; ++i) {
                var val = killer[i];
                var index = a.indexOf(val);
                if (index >= 0) {
                    a.splice(index, 1);
                }
            }
            return a;
        },

        tryParseDate : function (sDate) {
            return (
                sDate.constructor === Date ? sDate :
                sDate.constructor === Array ? new Date(sDate[0], sDate[1], sDate[2]) :
                sDate.constructor === Number ? new Date(sDate) :
                sDate.constructor === String ? new Date(sDate) :
                typeof sDate === "object" ? new Date(sDate.year, sDate.month, sDate.date) :
                NaN
            );
        },

        parseDate : function (sDate) {
            var date = sDate ? this.tryParseDate(sDate) : new Date();
            return date.toISOString();
        },

        parseDateGMT : function (sDate) {
            var date = sDate ? this.tryParseDate(sDate) : new Date();
            return date.toGMTString()
        },

        parseDateGMTAddDays : function (sDate, days) {
            var date = sDate ? this.tryParseDate(sDate) : new Date();
            if (!days)
                return date.toGMTString()

            date.addDays(days);
            return date.toGMTString();
        },

        parseDateGMTAddHours : function (sDate, hours) {
            var date = sDate ? this.tryParseDate(sDate) : new Date();
            if (!hours)
                return date.toGMTString()

            date.addHours(hours);
            return date.toGMTString();
        },

        parseDateDDMMYYY : function (sDate, separator) {
            if(!sDate)
                return;

            var dateParts = sDate.split(separator || "/");
            if (!dateParts || dateParts.length != 3)
                return;

            var dateObj = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
            return dateObj;
        },

        dateToString : function (date) {
            if(!date)
                return;

            var dd = date.getDate();
            var mm = date.getMonth()+1; //January is 0!

            var yyyy = date.getFullYear();
            if(dd < 10) dd ='0'+dd;
            if(mm < 10) mm ='0'+mm;
            var stringDate = dd + '/' + mm + '/' + yyyy;
            return stringDate;
        },

        compareDate : function (a, b) {
            //  -1 : if a < b
            //   0 : if a = b
            //   1 : if a > b
            return (
                isFinite(a = this.formatDate(a).valueOf()) &&
                isFinite(b = this.formatDate(b).valueOf()) ?
                (a > b) - (a < b) :
                NaN
            );
        },

        inRangeDate : function (d, start, end) {
            // Checks if date in d is between dates in start and end.
            // Returns a boolean or NaN:
            //    true  : if d is between start and end (inclusive)
            //    false : if d is before start or after end
            //    NaN   : if one or more of the dates is illegal.
            // NOTE: The code inside isFinite does an assignment (=).
            return (
                isFinite(d = this.formatDate(d).valueOf()) &&
                isFinite(start = this.formatDate(start).valueOf()) &&
                isFinite(end = this.formatDate(end).valueOf()) ?
                start <= d && d <= end :
                NaN
            );
        },

        getMonthName : function (lang) {
            var monthTab;
            switch (lang) {
                case 'fr':
                    monthTab = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];
                    break;
                case 'en':
                default:
                    monthTab = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    break;
            }
            return monthTab;
        },

        getCurrentMonthName : function (lang) {
            if (!lang) lang = "en";
            var today = new Date();
            var monthes = this.getMonthName(lang);
            return monthes[today.getMonth()];
        }
    }

    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return jsext.trim(this);
        }
    }

    if(!Function.prototype.extends) {
        Function.prototype.extends = function (ParentClass) {
            if (ParentClass.constructor == Function) {
                this.prototype = new ParentClass;
                this.prototype.constructor = this;
                this.prototype.parent = ParentClass.prototype;
            } else {
                this.prototype = ParentClass;
                this.prototype.constructor = this;
                this.prototype.parent = ParentClass;
            }
        }
    }
 
    if(!String.prototype.format) {
        String.prototype.format = function () {
            return jsext.format(this, arguments);
        }
    }
    
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function(searchString, position){
            position = position || 0;
            return this.substr(position, searchString.length) === searchString;
        }
    }

    if(!RegExp.escape) {
        RegExp.escape = function (text) {
            return jsext.escape(text);
        }
    }

    if(!Array.prototype.unique) {
        Array.prototype.unique = function () {
            return jsext.unique(this);
        }
    }

    if(!Array.prototype.removeArray) {
        Array.prototype.removeArray = function (killer) {
            return jsext.removeArray(this, killer);
        }
    }

    if(!Date.prototype.addHours) {
        Date.prototype.addHours = function(h) {    
            this.setTime(this.getTime() + (parseInt(h)*60*60*1000)); 
            return this;   
        }
    }

    if(!Date.prototype.addDays) {
        Date.prototype.addDays = function (days) {
            this.setTime(this.getTime() + (parseInt(days) * 24 * 60 * 60 * 1000));
            return this;
        }
    }

    if(!Date.prototype.minusHours) {
        Date.prototype.minusHours = function (h) {
            this.setTime(this.getTime() - (parseInt(h) * 60 * 60 * 1000));
            return this;
        }
    }

    if(!Date.prototype.minusDays) {
        Date.prototype.minusDays = function (days) {
            this.setTime(this.getTime() - (parseInt(days) * 24 * 60 * 60 * 1000));
            return this;
        }
    }

    return jsext;
})();
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
MenuBar = (function(angular, app) {
    return app.directive("menuBar", function () {
        return {
            restrict : "AE",
            templateUrl : "/components/ui/menubar.html"
        }
    });
})(angular, app);
StickyElem = (function(angular, app) {
    return app.directive("stickyElem", ["$window", function ($window) {
        function StickyElemLink (scope, element) {
            var w = angular.element($window);
            var size = element[0].clientHeight;
            var top = 0;

            function toggleStickyNav () {
                if(!element.hasClass(scope.stickyclass) && $window.pageYOffset > top + size){
                    element.addClass(scope.stickyclass);
                } else if(element.hasClass(scope.stickyclass) && $window.pageYOffset <= top + size){
                    element.removeClass(scope.stickyclass);
                }
            }

            scope.$watch(
                function() {
                    return element[0].getBoundingClientRect().top + $window.pageYOffset;
                }, 
                function(newValue, oldValue) {
                    if(newValue !== oldValue && !element.hasClass(scope.stickyclass)) {
                        top = newValue;
                    }
                }
            );

            w.bind('resize', function stickyNavResize() {
                element.removeClass(scope.stickyclass);
                top = element[0].getBoundingClientRect().top + $window.pageYOffset;
                toggleStickyNav();
            });
            w.bind('scroll', toggleStickyNav);
        }

        return {
            scope : {
                stickyclass : "@stickyclass"
            },
            restrict : "CA",
            link : StickyElemLink
        };
    }]);
})(angular, app);
LazyImage = (function(angular, app) {
    return app.directive("lazyimage", ["$window", function ($window) {
        function LazyImageLink (scope, element) {
            var w = angular.element($window);
            var loaded = false;
            scope.threshold = Number(scope.threshold) || 100;
            scope.background = scope.background != null;
            scope.errorimage = scope.errorimage || "/images/image-not-found.png";
            scope.presrc = scope.presrc || "/images/image-loading.png";

            function loadImage () {
                if(loaded)
                    return;

                if (scope.background) {
                    element[0].style.backgroundImage = 'url("' + scope.imgsrc +'")';
                } else {
                    element[0].src = scope.imgsrc;
                }

                loaded = true;
            }

            function loadPreImage () {
                if (scope.background)
                    return;

                element[0].src = scope.presrc;
            }

            function inViewport(media) {
                var coordinates = media.getBoundingClientRect();
                return (
                    coordinates.bottom + scope.threshold >= 0 &&
                    coordinates.left >= 0 &&
                    coordinates.top - scope.threshold <= ($window.innerHeight || document.documentElement.clientHeight) &&
                    coordinates.right <= ($window.innerWidth || document.documentElement.clientWidth)
                );
            }

            function onChangeViewport () {
                if(loaded)
                    return;

                if(!inViewport(element[0]))
                    return;

                loadImage();
            }

            w.bind("scroll", onChangeViewport);
            w.bind("resize", onChangeViewport);
            loadPreImage();
        }

        return {
            scope : {
                "imgsrc" : "@imgsrc",
                "presrc" : "@?src",
                "background" : "@?background",
                "threshold" : "@?threshold",
                "errorimage" : "@?error"
            },
            restrict : "CA",
            link : LazyImageLink
        };
    }]);
})(angular, app);