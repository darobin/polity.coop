
var TT = require("Template").Template,
    sys = require("sys"),
    fs = require("fs");

exports.app = function (request) {
    // XXX this should be autoconfigured, provided as a service
    //     especially the file reading!
    //     it would be good if TT could stream the output somehow
    // XXX in fact we should fix this directly in Template, and make sure it's efficient
    //     enough
    //      - add processFileSync(file, vars) which is the simple version below and
    //        processFile(file, vars) which will know whether to use callback or
    //        promises depending on arguments and availability
    // TT.Context.prototype.load_file = function load_file (file) { 
    //     try { return fs.readFileSync(file); }
    //     catch (e) { throw new TT.Exception("file", Template.escapeString(file) + ": really not found"); }
    // }
    var tt = new TT({INCLUDE_PATH: ["./lib/templates"]});
    var res = tt.process(fs.readFileSync("./lib/templates/index.tt"), { test: "foo" });
    
    return {
        status:     200,
        headers:    { "Content-Type": "text/html" },
        body: [ res ],
    };
};
