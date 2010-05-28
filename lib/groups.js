
exports.app = function (request) {
    return {
        status:     200,
        headers:    { "Content-Type": "text/plain" },
        body: [ "I am the groups application, called with path " + request.pathInfo ],
    };
};
