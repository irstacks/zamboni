// var pgtools = require('pgtools');
// var Sequelize = require('sequelize');
// var db = new Sequelize('zamboni-db', null, null, {
// 	dialect: 'postgres'
// });
var models  = require('./models');

// function init() {
// 	return pgtools.createdb({
// 	  user: 'zamboni',
// 	  password: 'zamboni',
// 	  port: 5432,
// 	  host: 'localhost'
// 	}, 'zamboni-db', function (err, res) {
// 	  if (err) {
// 	    console.error('Error creating DB. \nIt\s possible the DB already existed.\n'+res);
// 	    // process.exit(-1);
// 	  }
// 	  console.log('Created DB.');
// 	  // process.exit(0); // success
// 	});
// };

// Import models.
// var Team = db.import(__dirname + '/models/team');
// 		Team.sync(); // ensure created

// var Player = db.import(__dirname + '/models/player');
// 		Player.sync();

// var Game = db.import(__dirname + '/models/game');
// 		Game.sync();

// var TeamPlayer = db.import(__dirname + '/models/team_player');
// 		TeamPlayer.belongsTo(Team);
// 		TeamPlayer.belongsTo(Player);
// 		TeamPlayer.belongsTo(Game);
// 		TeamPlayer.sync();


// Model methods. 
function findOrCreate(Model, opts) {
	return models[Model].findOrCreate(opts);
}

function findOne(Model, opts) {
	return models[Model].findOne(opts);
}

function findAll(Model) {
	return models[Model].findAll();
}



