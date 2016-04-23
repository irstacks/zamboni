var pgtools = require('pgtools');
var util = require('util');
var models  = require('./models'); // uses models/index.js to collect all models in that dir
var _ = require('underscore');

function init() {
	return pgtools.createdb({
	  user: 'zamboni',
	  password: 'zamboni',
	  port: 5432,
	  host: 'localhost'
	}, 'zamboni-db', function (err, res) {
	  if (err) {
	    console.error('Error creating DB. \nIt\s possible the DB already existed.\n'+res);
	    // process.exit(-1);
	  }
	  console.log('Created DB.');

	  // process.exit(0); // success
	});
};
function dropper() {
	return pgtools.dropdb({
	  user: 'zamboni',
	  password: 'zamboni',
	  port: 5432,
	  host: 'localhost'
	}, 'zamboni-db', function (err, res) {
	  if (err) {
	    console.error('Error creating DB. \nIt\s possible the DB already existed.\n'+res);
	    // process.exit(-1);
	  }
	  console.log('Dropped DB.');
	  // process.exit(0); // success
	});
}

var boston = {name: 'BOSTON BRUINS', abbreviation: 'BOS'};
var florida = {name: 'FLORIDA PANTHERS', abbreviation: 'FLA'};

function create(modelArg, optsArg) {
	return models[modelArg].create(opts);
}

function findOrCreate(modelArg, optsArg) {
	return models[modelArg].findOrCreate({where: optsArg});
}

function getById(modelArg, idArg) {

	// if id arg was bad. 
	if (typeof idArg !== 'number') { console.log('not a number id!'); return null; }
	return models[modelArg].findById(idArg);
}

module.exports = {
	init: init,
	dropper: dropper,
	create: create,
	findOrCreate: findOrCreate,
	getById: getById
}
