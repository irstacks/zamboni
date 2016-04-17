'use strict';

var walk = require('walk')
	, fs = require('fs')
	, util = require('util')
	, pg = require('./database.js')
	, walkMe
	, walker
	;


walkMe = './testStorage';
walker = walk.walk(walkMe); //, options

walker.on("file", function (root, fileStats, next) {
  fs.readFile(fileStats.name, function () {
    // doStuff
    console.log(util.inspect(fileStats));
    next();
  });
});

walker.on("errors", function (root, nodeStatsArray, next) {
  next();
});

walker.on("end", function () {
  console.log("all done");
});