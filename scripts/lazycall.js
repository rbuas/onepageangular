/////////////////////////////////////////////////////////////////
// lazycall
/////////////////////////////////////////////////////////////////
lazycall = (function () {
    return {
        onload: function (callback) {
            if (!callback || typeof (callback) != "function") return console.log("lazycall parameter error");
            if (window.addEventListener) { // W3C standard
                window.addEventListener('load', callback, false);
            }
            else if (window.attachEvent) { // Microsoft
                window.attachEvent('onload', callback);
            }
        },

        onready: function (callback) {
            if (!callback || typeof (callback) != "function") return console.log("lazycall parameter error");
            if (window.addEventListener) { // W3C standard
                document.addEventListener('DOMContentLoaded', callback);
            }
            else if (window.attachEvent) { // Microsoft
                document.attachEvent("onreadystatechange", function () {
                    if (document.readyState === "complete") {
                        callback();
                    }
                });
            }
        },

        loadScript: function (url, callback) {
            var script = document.createElement("script")
            script.type = "text/javascript";

            if (script.readyState) {  //IE
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else {  //Others
                script.onload = function () {
                    callback();
                };
            }

            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);
        }
    }
})();