
// this is a simple routing framework
// it works with Cascade and Jack, so that all must return something with:
// {
//     status:  HTTP code,
//     headers: { headers... },
//     body: that supports forEach which return something that can do toByteString()
// }

// var defer   = require("promise").defer;
exports.AppRoute = function (route, del, app) {	
	return function (request) {
        var path = request.pathInfo; // look into JSGI request objects
        var e404 = { status: 404, headers: { "Content-Type": "text/plain" }, body: [ "Path " + path + " not found" ] };
        if (route instanceof RegExp) return route.test(path) ? ok(request, route, del, app) : e404;
        else if (path == route)      return route == path ? ok(request, route, del, app) : e404;
        return e404;
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
