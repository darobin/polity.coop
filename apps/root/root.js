
var pt          = require("petrichor"),
    Cascade     = pt.Cascade,
    AppRoute    = pt.AppRoute,
    Static      = pt.Static;

exports.app = function (request) {
    return (Cascade([
        Static({ urls: ["/css", "/img", "/js", /\.html$/, "/favicon.ico"], roots: ["./static"] }),
        AppRoute("", false, require("home/home").app), // XXX check if this is needed, or if we can eliminate it
        AppRoute("/", false, require("home/home").app),
        AppRoute(/^\/users\//, true, require("users/users").app),
        AppRoute(/^\/groups\//, true, require("groups/groups").app),
        AppRoute(/^\/docs\//, true, require("docs/docs").app),
        AppRoute(/^\/archives\//, true, require("archives/archives").app),
    ]))(request);
};

