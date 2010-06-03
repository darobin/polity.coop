#!/usr/bin/env node

var sys     = require("sys"),
    fs      = require("fs"),
    exec    = require('child_process').exec;

// --- CONFIG
var depends = [
    "git://github.com/kriszyp/commonjs-utils.git",
    "git://github.com/kriszyp/perstore.git",
    "git://github.com/kriszyp/pintura.git",
    "git://github.com/darobin/template.git",
    "git://github.com/christkv/node-mongodb-native.git",
    "git://github.com/kriszyp/jack.git",
    "git://github.com/kriszyp/jsgi-node.git",
    "git://github.com/kriszyp/narwhal.git",
    "git://github.com/kriszyp/nodules.git",
];
var verbose = false; // XXX need a CLI
// ---/CONFIG

// establish base
// XXX this might go into a common-tools module, along with setting path
var name = "tools/update-dependencies.js";
var base = process.argv[1];
if (base.indexOf(name) < 0) {
    sys.puts("Script not called as " + name + ", unsure how to resolve base directory.");
    process.exit(1);
}
base = base.replace(new RegExp(name + ".*$"), "");
var packs = base + "depends/";

// command output
function makeCommandOutput (okmsg) {
    return function (error, stdout, stderr) {
        if (verbose) {
            sys.print("stdout: " + stdout);
            sys.print("stderr: " + stderr);
        }
        if (error !== null) sys.puts("Error: " + error);
        else                sys.puts(okmsg);
    };
}

// check each dependency
var paths = [];
for (var i = 0, n = depends.length; i < n; i++) {
    var dep = depends[i];
    var dir = (/([^\/]*)\.git$/.exec(dep))[1];
    paths.push(packs + dir + "/lib");
    var cwd = process.cwd();
    try {
        var stat = fs.statSync(packs + dir);
        process.chdir(packs + dir);
        exec("git pull", makeCommandOutput("git pull " + dir + " OK"));
    }
    catch (e) {
        process.chdir(packs);
        exec("git clone " + dep, makeCommandOutput("git close " + dep + " OK"));
    }
    process.chdir(cwd);
}

// write out the node_paths file
var node_paths = "# this file is auto-generated, your edits may be lost\nexport NODE_PATH=" + paths.join(":") + ":\$NODE_PATH";
fs.writeFileSync(base + "node_paths", node_paths);
