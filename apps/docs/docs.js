
exports.app = function (request) {
    return {
        status:     200,
        headers:    { "Content-Type": "text/plain" },
        body: [ "I am the docs application, called with path " + request.pathInfo ],
    };
};
