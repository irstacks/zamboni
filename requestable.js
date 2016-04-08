var request = require('request');
var fs = require('fs');

/**
 * Store local version of site so don't have to ping during testing. For stealthiness. 
 * @param  {String} body Body of file to write
 * @return {void}        Or error. 
 */
exports.storeLocal = function(toFile, body) {
	fs.writeFile(toFile, body, function(err) {
		if (err) {
			return console.log(err);
		}
		console.log('Saved it! @ ' + toFile );
	});
};

exports.locally = function (fromFile, callback) {
	return fs.readFile(fromFile, 'utf8', function(err, body) {
		// if (err) throw err;
		if (err) console.log('eRRRERRrorr' + err);
		callback(body);
	});		
};

exports.internets = function(fromUrl, callback) {
	return request(fromUrl, function(err, res, body) {
		if (err) return console.log('ERRORORRRRR!', err);
		if (!err && res.statusCode === 200) {
			callback(body);
		}
	});
};