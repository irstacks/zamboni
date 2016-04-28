var express = require('express');
var fs = require('fs-extra');

// Start this with 'node testServer.js' command from the root dir

var app  = express();

app.get('/gameJson', function(req, res){
  var content = fs.readJson('./dataOut/20122013/020001.json', function(err, packageObj){
    console.log(err ? err : "No errors, all good!");
    res.json(packageObj);
  });
});

app.listen(3000, function () {
  console.log('Test server listening on port 3000!');
});
