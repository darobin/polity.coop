#!/usr/bin/env node

var sys     = require("sys"),
    fs      = require("fs"),
    exec    = require('child_process').exec;

// --- CONFIG
var depends = [
    "git://github.com/kriskowal/narwhal-lib.git",
    "git://github.com/kriskowal/narwhal-node.git",
];
var makes = {
    "narwhal-node": true,
};
var verbose = false; // XXX need a CLI
// ---/CONFIG

// establish base
// XXX this might go into a common-tools module, along with setting path
var name = "tools/setup.js";
var base = process.argv[1];
if (base.indexOf(name) < 0) {
    sys.puts("Script not called as " + name + ", unsure how to resolve base directory.");
    process.exit(1);
}
base = base.replace(new RegExp(name + ".*$"), "");
var packs = base + "commonjs/";

// create packages
try         { var stat = fs.statSync(packs); }
catch (e)   { 
    try { fs.mkdirSync(packs, 0755); }
    catch (e) { throw new Error("Cannot create " + packs + ": " + e); }
}

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
for (var i = 0, n = depends.length; i < n; i++) {
    var dep = depends[i];
    var dir = (/([^\/]*)\.git$/.exec(dep))[1];
    var cwd = process.cwd();
    var pull = false;
    try {
        var stat = fs.statSync(packs + dir);
        pull = true;
        process.chdir(packs + dir);
        exec("git pull", makeCommandOutput("git pull " + dir + " OK"));
    }
    catch (e) {
        process.chdir(packs);
        exec("git clone " + dep, makeCommandOutput("git clone " + dep + " OK"));
    }
    if (makes[dir]) {
        if (!pull) process.chdir(dir);
        exec("make", makeCommandOutput("make in " + dir + " OK"));
    }
    process.chdir(cwd);
}

// these need make to run
for (var i = 0, n = makes.length; i < n; i++) {
    var make = makes[i];
    
}


