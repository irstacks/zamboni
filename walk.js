'use strict';

var walk = require('walk')
	, fs = require('fs')
	, util = require('util')
	, pg = require('./database.js')
	, data = require('./data.js')
	, walkMe
	, walker
	;


walkMe = './testStorage/';
walker = walk.walk(walkMe);

function fileToJSON(body) {

}

walker.on("file", function (root, fileStats, next) {
  if (fileStats.name !== '.DS_Store' && fileStats.name.indexOf('.txt') < 0) {
  	fs.readFile(walkMe + fileStats.name, 'utf8', function(err, body) {
  		 
  		if (err) { console.log('error! ' + err); return next(); }

  		var j = JSON.parse(body);

  		// TODO: pass to postgres here.
  		console.log(util.inspect(j));


  		next();
  	});
  } else {
  	next();
  }
});

walker.on("errors", function (root, nodeStatsArray, next) {
  next();
});

walker.on("end", function () {
  console.log("Finished walk.");
});