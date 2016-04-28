var express = require('express');
var fs = require('fs-extra');
var shotFilter = require('./shotFilter');

// Start this with 'node testServer.js' command from the root dir

var app  = express();

app.get('/', function(req, res){
  res.send("raw game data endpoint: /testGameJson, filtered raw shots data endpoint: /testShots");
});

app.get('/testGameJson', function(req, res){
  var content = fs.readJson('././dataOut/20122013/020001.json', function(err, packageObj){
    res.json(packageObj);
  });
});

app.get('/testShots', function(req, res){
  var content = fs.readJson('././dataOut/20122013/020001.json', function(err, packageObj){
    res.json(shotFilter(packageObj));
  });
});

app.listen(3000, function () {
  console.log('Test server listening on port 3000!');
});
