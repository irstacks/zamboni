var request = require('request');
var fs = require('fs');

/**
 * Save string to file. 
 * @param  {String} body Body of file to write
 * @return {void}        Or error. 
 */
exports.saveToFile = function(toFile, body) {
	fs.writeFile(toFile, body, function(err) {
		if (err) {
			return console.log(err);
		}
		console.log('Saved it! @ ' + toFile );
	});
};

// Get data from file or url. Both are promisey, so arg2 is callback. 

exports.getFromFile = function (fromFile, callback) {
	return fs.readFile(fromFile, 'utf8', function(err, body) {
		// if (err) throw err;
		if (err) console.log('eRRRERRrorr' + err);
		callback(body);
	});		
};

exports.getFromUrl = function(fromUrl, callback) {
	return request(fromUrl, function(err, res, body) {
		if (err) return console.log('ERRORORRRRR!', err);
		if (!err && res.statusCode === 200) {
			callback(body);
		}
	});
};