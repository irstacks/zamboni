'use strict';
module.exports = function(sequelize, DataTypes) {
	var Jersey = sequelize.define('Jersey', 
		{
			player_id: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			team_id: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			year: {
				type: DataTypes.INTEGER, // first year of season
				allowNull: false
			},
			number: {
				type: DataTypes.INTEGER,
				allowNull: false
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

	return Jersey;
};