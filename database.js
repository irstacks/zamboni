var pgtools = require('pgtools')
var Sequelize = require('sequelize')
var db = new Sequelize('zamboni-test-db', null, null, {
	dialect: 'postgres'
})

// this is a model
var Post = db.define('post', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	title: {
		type: Sequelize.STRING
	},
	content: {
		type: Sequelize.TEXT
	} 
	// and other attrs... 
})


function testPost() {
	// ensure table has been created if doesn't exist already
	return Post.sync().then(function() {
		
		// create placeholder data
		var data = {
			title: 'Hellloooo',
			content: 'Fill this later'
		}
		// create the data in the db
		Post.create(data).then(function(post) {
			console.log(post.get()) // check it out
		})
	})	
}

exports.init = function() {
	pgtools.createdb({
	  user: 'zamboni',
	  password: 'zamboni',
	  port: 5432,
	  host: 'localhost'
	}, 'zamboni', function (err, res) {
	  if (err) {
	    console.error(err);
	    process.exit(-1);
	  }
	  console.log(res);
	  process.exit(0); // success
	});
};

// init();

// testPost();