// this launches everything...
try {
    var appPath = process.argv[1].replace("lib/petrichor-run.js", "");
    require.paths.unshift(appPath + "apps", appPath + "lib");

    var root = require("root/root").app;
    require("jsgi-node").start( root, { port: 8080 } );
    require("repl").start().scope.require = require;
}
catch (e) {
    require("sys").puts("ERROR: " + e);
}
