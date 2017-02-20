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