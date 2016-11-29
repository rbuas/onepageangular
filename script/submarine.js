submarine = (function ($, tracer) {
    var defaultOptions = {
        module : "Submarine",
        dependencies : ['ngRoute', 'ngSanitize', 'ngTouch'],
        views : "/views",
        common : "/common.res",
        map : {
            "default" : "default",
            "common" : "common",
            "pages" : "pages",
            "page" : "page"
        }
    };

    function Submarine (options) {
        var _this = this;
        this.ready = false;
        this.waiting = 0,
        this.firstaccess = true;

        this.options = $.extend({}, defaultOptions, options);

        loadResource(_this, "common", _this.options.common);
        startModule(_this);
        this.ready = true;
        this.data = [];
    }

    Submarine.prototype = {
        broadcast : function (event) {
            if(!this.root || !this.ready)
                return;

            tracer.comm('submarine::broadcast: ', event);
            this.root.$broadcast(event);
        },

        controller : function (controllerId, controller) {
            //create a controller linket to the module
            return this.module.controller(controllerId, controller);
        },

        directive : function (directiveId, controller) {
            //create a controller linket to the module
            return this.module.directive(directiveId, controller);
        },

        error : function (error) {
            if(error == null)
                return this.errors;

            if(!this.errors) 
                this.errors = [];
            this.errors.push(error);

            this.broadcast("error");
            return error;
        },

        updateData : function (key, value) {
            this.data[key] = value;

            this.broadcast(key);
            return value;
        },

        update : function (tab) {
            if(!tab)
                return;

            var _this = this;
            for(key in tab) {
                _this.updateData(key, tab[key]);
            }
        }
    };


    function load (filename) {
        tracer.comm("submarine::loadfile: ", filename);
        return $.ajax({
            url: filename,
            contentType: "application/json; charset=utf-8",
            dataType : "json",
            success: function (data) {
                tracer.comm("submarine::loadfile::Response (" + filename + "): ", data);
                return data;
            },
            error: function (xhr, status, error) {
                tracer.error("submarine::loadfile::Response (" + filename + ") ERROR :", error);
                return error;
            }
        });
    }

    function loadResource ( instance, key, filename ) {
        if(!instance) return;

        return load(filename).then(
            function success (data) { return instance.updateData(key, data); },
            function error (error) { return instance.error(error); }
        );
    }

    function startModule (instance) {
        if(!instance) return;

        var views = instance.options.views || "";

        instance.module = angular.module(instance.options.module, instance.options.dependencies)
        .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

            for(route in instance.options.map) {
                var template = instance.options.map[route];
                $routeProvider.when('/' + route, {templateUrl: views + template + '.html'});
            }
        }]);
    }

    var submarine = new Submarine();

    submarine.controller('SubmarineController', ['$scope', '$rootScope', function SubmarineController ($scope, $rootScope) {
        var sc = this;

        // $scope.$watch(Submarine.DATA.DATACHANGE, function(event, args) {
        //     tracer.comm("submarinecontroller::datachange: ", submarine.data, true);
        //     sc.data = submarine.data;

        //     //$scope.$apply();
        // });

        // $scope.$on(Submarine.DATA.CURRENTPAGE, function() {
        //     sc.currentpage = submarine.data[Submarine.DATA.CURRENTPAGE];
        //     $scope.$apply();
        // });

        $rootScope.$on('$includeContentLoaded', function() {
            // card scrolling feature - requires jQuery Easing plugin
            $('a.card').bind('click', function(event) {
                var anchor = $(this);
                var href = anchor.attr('href');
                $('html, body').stop().animate({
                    scrollTop: $(href).offset().top
                }, 1500, 'easeInOutExpo');
                event.preventDefault();
            });

            // highlight the top nav as scrolling occurs
            $('body').scrollspy({
                target: '.navbar-fixed-top'
            })

            // closes the Responsive Menu on Menu Item Click
            $('.navbar-collapse ul li a').click(function() {
                $('.navbar-toggle:visible').click();
            });

            //header animation 
            var didScroll = false;
            var docElem = document.documentElement;
            var header = $( '.navbar-default' );
            var changeHeaderOn = 300;

            function scrollPage() {
                var sy = scrollY();
                if ( sy >= changeHeaderOn ) {
                    header.addClass( 'navbar-shrink' );
                }
                else {
                    header.removeClass( 'navbar-shrink' );
                }
                didScroll = false;
            }

            function scrollY() {
                return window.pageYOffset || docElem.scrollTop;
            }

            window.addEventListener( 'scroll', function( event ) {
                if( !didScroll ) {
                    didScroll = true;
                    setTimeout( scrollPage, 250 );
                }
            }, false );

            window.onload = function( event ) {
                if( !didScroll ) {
                    didScroll = true;
                    setTimeout( scrollPage, 250 );
                }
            }
        });
    }]);

    return submarine;
})(jQuery, Tracer);