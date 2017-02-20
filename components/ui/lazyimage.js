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