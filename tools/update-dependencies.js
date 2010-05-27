#!/usr/bin/env node

var sys     = require("sys"),
    fs      = require("fs"),
    exec    = require('child_process').exec;

// --- CONFIG
var depends = [
    "git://github.com/kriszyp/commonjs-utils.git",
    "git://github.com/kriszyp/perstore.git",
    "git://github.com/kriszyp/pintura.git",
    "git://github.com/ashb/template.git",
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
var packs = base + "packages/";

// create packages
try         { var stat = fs.statSync(packs); }
catch (e)   { fs.mkdir(packs); }

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
    try {
        var stat = fs.statSync(packs + dir);
        process.chdir(packs + dir);
        exec("git pull", makeCommandOutput("git pull " + dir + " OK"));
    }
    catch (e) {
        process.chdir(packs);
        exec("git clone " + dep, makeCommandOutput("git clone " + dep + " OK"));
    }
    process.chdir(cwd);
}






