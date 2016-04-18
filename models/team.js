'use strict';
module.exports = function(sequelize, DataTypes) {
	var Team = sequelize.define('team', 
		// Attributes.
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			name: {
				type: DataTypes.STRING // 'BOSTON BRUINS'
				, allowNull: false
				// , defaultValue: null
			},
			abbreviation: {
				type: DataTypes.STRING // 'BOS'
			} 
		}, 
		// Indexes.
		{ 
			indexes: [
		    {
		      unique: true,
		      fields: ['name', 'abbreviation']
		    }
		  ]
	  }
	  // Class methods and associations.
	  // ,{
	  //   classMethods: {
	  //     associate: function(models) {
	  //       Team.hasMany(models.TeamPlayers)
	  //     }
	  //   }
	  // }
  );

  return Team;
};