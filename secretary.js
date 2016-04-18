var dd = require('./database');
var models  = require('./models');
var util = require('util');
var _ = require('underscore');

exports.iEatGamesAndPoopRelationships = function(jsonData){
	var jd = jsonData; // from /dataOut/file.json

	// console.log(util.inspect(jd));

	var homeTeam = {
		name: jd.scoreboard.home.name,
		// abbreviation: jd.events[0].keys[8].split(' ')[0]
		abbreviation: _.keys(jd.events[0])[8].split(' ')[0]
	};

	var awayTeam = {
		name: jd.scoreboard.visitor.name,
		// abbreviation: jd.events[0].keys[7].split(' ')[0]
		abbreviation: _.keys(jd.events[0])[7].split(' ')[0]
	};

	var game = {};

	return dd.findOrCreate('Team', homeTeam)
	.then(function setHomeTeamId(hometeam) {
		console.log(hometeam[0].dataValues['id']);
		homeTeam['id'] = hometeam[0].dataValues['id'];
	})
	.then(dd.findOrCreate('Team', awayTeam)
	.then(function setAwayTeamId(awayteam) {
		console.log(awayteam[0].dataValues['id']);
		awayTeam['id'] = awayteam[0].dataValues['id'];
	}))
	.then(function() {
		console.log(util.inspect(homeTeam));
		console.log(util.inspect(awayTeam));
		var gameData = {
			date_human: jd.meta.date,
			// date_unix: // TODO
			year: parseInt(jd.meta.date.split(',').pop().trim(), 10),
			game_num: parseInt(jd.meta.gameNum.split(' ').pop(), 10),
			team_home_id: homeTeam['id'],
			team_away_id: awayTeam['id'],
			team_home_game_count: parseInt(jd.scoreboard.home.games.split(' ')[1], 10),
			team_away_game_count: parseInt(jd.scoreboard.visitor.games.split(' ')[1], 10),
			team_home_home_game_count: parseInt(jd.scoreboard.home.games.split(' ').pop(), 10),
			team_away_away_game_count: parseInt(jd.scoreboard.visitor.games.split(' ').pop(), 10),
			team_home_score: parseInt(jd.scoreboard.home.score, 10),
			team_away_score: parseInt(jd.scoreboard.visitor.score, 10),
			// was_tie: function() {
			// 	var usScore = parseInt(jd.scoreboard.home.score, 10);
			// 	var theirScore = parseInt(jd.scoreboard.visitor.score, 10);
			// 	return usScore === theirScore ? true : false;
			// },
			// // was_tie: // TODO
			// winner_team_id: function() {
			// 	if (parseInt(jd.scoreboard.home.score, 10) === parseInt(jd.scoreboard.visitor.score, 10)) { return null; } 
			// 	return parseInt(jd.scoreboard.home.score, 10) > parseInt(jd.scoreboard.visitor.score, 10) ? homeTeam.id : awayTeam.id;
			// },
			// loser_team_id: function() {
			// 	if (parseInt(jd.scoreboard.home.score, 10) === parseInt(jd.scoreboard.visitor.score, 10)) { return null; } 
			// 	return parseInt(jd.scoreboard.home.score, 10) < parseInt(jd.scoreboard.visitor.score, 10) ? homeTeam.id : awayTeam.id;
			// },
			
			asses: jd.meta.assesInSeats,
			clocks: jd.meta.clocks
		};

		console.log(util.inspect(gameData));

		dd.findOrCreate('Game', gameData);
		// .then(function madeGame(newGame) {
		// 	console.log('MAAADEEE GAMEEEEE!' + newGame);
		// 	// game['id'] = newGame.id
		// });

	})
	.then(function allFinished() {
		console.log('I did it.');
	});

}

