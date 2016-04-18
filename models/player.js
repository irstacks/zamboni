'use strict';

module.exports = function(sequelize, DataTypes) {
	var Player = sequelize.define('Player', 
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			first_name: {
				type: DataTypes.STRING // 'STEVEN'
				, allowNull: false
			},
			last_name: {
				type: DataTypes.STRING // 'KAMPFER'
				, allowNull: false
			}
		}, 
	  {
	  	getterMethods   : {
  	    full_name       : function()  { return this.first_name + ' ' + this.last_name }
  	  },
  	  setterMethods   : {
  	    full_name       : function(value) {
  	        var names = value.split(' ');
  
  	        this.setDataValue('first_name', names.slice(0, -1).join(' '));
  	        this.setDataValue('last_name', names.slice(-1).join(' '));
  	    },
  	  }
		}
		// , {
		// 	classMethods: {
		// 		associate: function(models) {
		// 		  Player.hasMany(models.TeamPlayers)
		// 		}
		// 	}
		// }
	);

	return Player;
};