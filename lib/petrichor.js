var fs      = require("nodules-utils/fs-promise"),
    syspath = require("path"),
    sys     = require("sys"),
	defer   = require("promise").defer,
	Buffer  = require('buffer').Buffer,
	mime    = require("jack/mime");

exports.AppRoute = function (route, del, app) {
	return function (request) {
        var path = request.pathInfo; // look into JSGI request objects
        var e404 = { status: 404, headers: { "Content-Type": "text/plain" }, body: [ "Path " + path + " not found" ] };
        if (route instanceof RegExp) return route.test(path) ? ok(request, route, del, app) : e404;
        else if (path == route)      return route == path ? ok(request, route, del, app) : e404;
        return e404;
    };
};

// XXX we can perhaps switch to promise-based cascade later, for now this is simpler
// exports.Cascade = require("jsgi/cascade").Cascade;
exports.Cascade = function (apps) {
    return function (request) {
        var lastResponse = { status: 404 };
        for (var i = 0, n = apps.length; i < n; i++) {
            var app = apps[i];
            lastResponse = app(request);
            if (lastResponse.status != 404) return lastResponse;
        }
        return lastResponse;
    };
}


// this is derived from pintura/jsgi/static
// the main differences are:
//  - it works (original version would just block on read(), not sure why)
//  - it accepts RegExps to match URLs
//  - it's secure against paths crafted to go read outside the defined root
//  - because read() didn't seem to work, it uses readFile() which is okay but should be
//    used for reasonably small files
exports.Static = function (options) {
	var options = options || {},
		urls = options["urls"] || ["/favicon.ico"],
		roots = options["roots"] || [""];
	
	return function (request) {
		var path = request.pathInfo;
		path = syspath.normalize(path);
		path = path.replace(/^(?:\/\.\.)+/, "");
		var e404 = {
		    status: 404,
			headers: { "Content-Type": "text/plain" },
			body: ["Error 404: " + path + " not found"]
		};
		for (var i = 0, n = urls.length; i < n; i++) {
		    if (((urls[i] instanceof RegExp) && urls[i].test(path)) || path.indexOf(urls[i]) === 0) {
				var rootIndex = 0;
				var responseDeferred = defer();
				checkNextRoot();
				return responseDeferred.promise;
		    }
		}
		return e404;
		function checkNextRoot(){ 
			if(rootIndex >= roots.length){
				responseDeferred.resolve(e404);
				return;
			}
			var file = roots[rootIndex] + path;
			rootIndex++;
			fs.stat(file)
				.then(function (stat) {
					if(stat.isFile()){
						fs.readFile(file, 'binary')
						    .then(function (data) {
                                var extension = path.match(/\.[^\.]+$/);
                                extension = extension && extension[0];
                                responseDeferred.resolve({
                                    status: 200,
                                    headers: {
                                        "Content-Length":   stat.size,
                                        "Content-Type":     extension && mime.mimeType(extension)
                                    },
                                    body: {
                                        forEach: function (callback) {
                                            callback(data);
                                        },
                                        encoding: "binary"
                                    }
                                });
							});
					}
					else{
						checkNextRoot();
					}
			}, checkNextRoot);
		}
	};
};

function ok (request, route, del, app) {
    if (del) {
        request.pathInfo = request.pathInfo.replace(route, "");
        if (request.pathInfo.indexOf("/") != 0) request.pathInfo = "/" + request.pathInfo;
    }
    try {
        return app(request);
    }
    catch (e) {
        return { status: 500, headers: { "Content-Type": "text/plain" }, body: [ "Application error " + e ] };
    }
}
