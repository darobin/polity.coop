
var sys = require("sys");

try {
    // var pinturaApp;
    var AppRoute;
    require.reloadable(function () {
        // pinturaApp = require("pintura/pintura").app;
    	require("app");
        AppRoute = require("petrichor").AppRoute;
    });

    require("jsgi-node").start(
    	require("pintura/jsgi/cascade").Cascade([ 
    	    // cascade from static to pintura REST handling
            require("statics").Static({ urls: ["/css", "/img", "/js", /\.html$/, "/favicon.ico"], roots: ["./static"] }),
            AppRoute("", false, require("home").app),
            AppRoute("/", false, require("home").app),
            AppRoute(/^\/users\//, true, require("users").app),
            AppRoute(/^\/groups\//, true, require("groups").app),
            AppRoute(/^\/docs\//, true, require("docs").app),
            AppRoute(/^\/archives\//, true, require("archives").app),
            // function (request) {
            //  return pinturaApp(request);
            // }
    ]));

    // having a REPL is really helpful
    require("repl").start().scope.require = require;
}
catch (e) {
    "ERROR: " + e;
}
