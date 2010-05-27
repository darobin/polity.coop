var pinturaApp;
require.reloadable(function(){
	pinturaApp = require("pintura/pintura").app;
	require("app");
});

require("jsgi-node").start(
	require("pintura/jsgi/cascade").Cascade([ 
	    // cascade from static to pintura REST handling
        require("statics").Static({ urls: ["/css", "/img", "/js", /\.html$/, "/favicon.ico"], roots: ["./static"] }),
		function (request) {
			return pinturaApp(request);
		}
]));

// having a REPL is really helpful
require("repl").start().scope.require = require;
