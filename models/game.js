'use strict';
module.exports = function(sequelize, DataTypes) {
	var Game = sequelize.define('Game', 
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			year_start: {
				type: DataTypes.INTEGER // 2015
				, allowNull: false
			},
			year_end: {
				type: DataTypes.INTEGER // 2016
				, allowNull: false
			},
			game_num: {
				type: DataTypes.INTEGER // 0048
				, allowNull: false
			},
			
			//
			// TODO: seasonality --- 
			//
			
			// TODO: handle associations w/r/t to keying & indexing better
			team_home_id: {
				type: DataTypes.INTEGER // 4
				, allowNull: false
			},
			team_away_id: {
				type: DataTypes.INTEGER // 31
				, allowNull: false
			},
			team_home_game_count: {
				type: DataTypes.INTEGER // 4
				, allowNull: false
			},
			team_away_game_count: {
				type: DataTypes.INTEGER // 5
				, allowNull: false
			},
			team_home_home_game_count: {
				type: DataTypes.INTEGER // 2
				, allowNull: false
			},
			team_away_away_game_count: {
				type: DataTypes.INTEGER // 3
				, allowNull: false
			},
			team_home_score: {
				type: DataTypes.INTEGER // 0
				, allowNull: false
			},
			team_away_score: {
				type: DataTypes.INTEGER // 2
				, allowNull: false
			},
			was_tie: {
				type: DataTypes.BOOLEAN // false
				, allowNull: false
				, defaultValue: false
			},
			was_shootout: {
				type: DataTypes.BOOLEAN // null || true|false
				, allowNull: false
				, defaultValue: false
			},
			winner_team_id: {
				type: DataTypes.INTEGER // 31
				, allowNull: true
			},
			loser_team_id: {
				type: DataTypes.INTEGER // 4
				, allowNull: true
			},
			// TODO: care about validation for the below more
			date_human: {
				type: DataTypes.STRING
			},
			date_unix: {
				type: DataTypes.INTEGER // because I don't want to fuck with SQL specific datetime formats
			},
			asses: {
				type: DataTypes.STRING
			}, 
			clocks: {
				type: DataTypes.STRING
			}
		}
		// , {
		// 	classMethods: {
		// 		associate: function(models) {
		// 		  Game.hasMany(models.TeamPlayers)
		// 		}
		// 	}
		// }
	);

	return Game;
};