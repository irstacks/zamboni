'use strict';
module.exports = function(sequelize, DataTypes) {
	var PlayerEvent = sequelize.define('PlayerEvent', 
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			event_id: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			player_id: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			team_id: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			position: {
				type: DataTypes.STRING // 'Center'
			}
		}
		// , {
		// 	classMethods: {
		// 		associate: function(models) {
		// 		  PlayerEvent.hasMany(models.TeamPlayers)
		// 		}
		// 	}
		// }
	);

	return PlayerEvent;
};