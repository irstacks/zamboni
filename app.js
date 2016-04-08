var data = require('./data.js');
var parseable = require('./parseable.js');

var exampleUrl = 'http://www.nhl.com/scores/htmlreports/20152016/PL010003.HTM';
var exampleFile = './localStore/test-input.html';

function handleHTML(html) {
	
	// Save to local file for now. 
	var whereToSave = './localStore/test-output.json';
	
	var parsedEvents = parseable.playByPlay(html);
	var parsedTeamData = parseable.jumbotron(html).teamData;
	
	var game = {
		meta: parseable.jumbotron(html).gameData,
		scoreboard: parseable.jumbotron(html).teamData,
		events: parseable.playByPlay(html)
	};
	data.saveToFile(whereToSave, JSON.stringify(game));
}

// Do the actual gettering. 
data.getFromFile(exampleFile, handleHTML);