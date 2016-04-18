'use strict';
module.exports = function(sequelize, DataTypes) {
	var GameEvent = sequelize.define('GameEvent', 
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			game_id: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			game_index: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			period: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			str: {
				type: DataTypes.STRING
			},
			description: {
				type: DataTypes.STRING
			},
			time_elapsed: {
				type: DataTypes.INTEGER // seconds
			},
			time_remaining: {
				type: DataTypes.INTEGER //seconds
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

	return GameEvent;
};