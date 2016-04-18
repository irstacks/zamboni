'use strict';
module.exports = function(sequelize, DataTypes) {
	var TeamPlayer =  sequelize.define('TeamPlayer', 
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			team_id: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			player_id: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			game_id: {
				type: DataTypes.INTEGER,
				allowNull: false
			}
		}
		

		// TODO: index me.
		// {
		// 	indexes: [
		// 		{
		// 			unique: true,
		// 			fields: ['']
		// 		}
		// 	]
		// } 
		// {
		// 	classMethods: {
		// 		associate: function(models) {
		// 			// TeamPlayer.belongsTo(models.Team, {
		// 			// 	onDelete: "CASCADE",
		// 			// 	foreignKey: {
		// 			// 		allowNull: false
		// 			// 	}
		// 			// }),
		// 			TeamPlayer.belongsTo(models.Player, {
		// 				onDelete: "CASCADE",
		// 				foreignKey: {
		// 					allowNull: false
		// 				}
		// 			}),
		// 			TeamPlayer.belongsTo(models.Game, {
		// 				onDelete: "CASCADE",
		// 				foreignKey: {
		// 					allowNull: false
		// 				}
		// 			});
		// 		}
		// 	}
		// }
	);

	return TeamPlayer;
};