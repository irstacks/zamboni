var data = require('./data.js');
var parseable = require('./parseable.js');
var gameUrl = require('./url-maker.js');
var log = require ('./log.js');
var util = require('util');

// var exampleUrl = 'http://www.nhl.com/scores/htmlreports/20152016/PL010003.HTM';
// var url404 = 'http://www.nhl.com/scores/htmlreports/20152016/PL090003.HTM';
// var exampleFile = './testStorage/test-input.html';

// TODO: implement a basic kind of local storage for history of trials
var year = 2015;
var gameSerialConst = [1, 0, 1]; // from the beginning. pre season, i think
var haveFailed = 0;
var dataOutFolder = './dataOut/' + year.toString() + (year + 1).toString() + '/';
var failOutFolder = './failOut/' + year.toString() + (year + 1).toString() + '/';

// Game number formatting helpers.
function zeroPad(int) {
	if (int.toString().length < 2) {
		return '0' + int.toString();
	}
	else {
		return int.toString();
	}
}
function makeGameNum(gameSerial) {
	console.log('Making game num', zeroPad(gameSerial[0]) + zeroPad(gameSerial[1]) + zeroPad(gameSerial[2]));
	return zeroPad(gameSerial[0]) + zeroPad(gameSerial[1]) + zeroPad(gameSerial[2]);
}

function incrementSuccess() {
	console.log('Incrementing success from ', util.inspect(gameSerialConst));
	if (gameSerialConst[2] < 99) {
		gameSerialConst[2]++;	
	} else if (gameSerialConst[1] < 99) {
		gameSerialConst[1]++;
		gameSerialConst[2] = 0;
	} else {
		gameSerialConst[0]++;
		gameSerialConst[1] = 0;
		gameSerialConst[2] = 0;
	}
	
	haveFailed = 0;
}

function incrementFailure() {
	console.log('Incrementing failure from ', util.inspect(gameSerialConst));

	if (haveFailed < 4) {
		gameSerialConst[2]++;
		haveFailed++;
	} else if (gameSerialConst[1] < 99) {
		gameSerialConst[1]++;
		gameSerialConst[2] = 0;
		haveFailed = 1;
	} else {
		gameSerialConst[0]++;
		gameSerialConst[1] = 0;
		gameSerialConst[2] = 0;
		haveFailed = 1;
	}
}

// Increment game num counter.
function handle404() {
	console.log('Handling 404');
	var whereToSave = failOutFolder + makeGameNum(gameSerialConst).toString() + '.txt';
	data.saveToFile(whereToSave, "404");
	incrementFailure();
}

// Parse response HTML for game data.
function handleSuccess(html) {
	console.log('Handling success');
	var whereToSave = dataOutFolder + makeGameNum(gameSerialConst).toString() + '.json';
	var game = {
		meta: parseable.jumbotron(html).gameData,
		scoreboard: parseable.jumbotron(html).teamData,
		events: parseable.playByPlay(html)
	};
	data.saveToFile(whereToSave, JSON.stringify(game));
	incrementSuccess();
}

function responseHandler(html) {
	if (html === 404) { console.log('Response handling 404.'); handle404(); }
	else {console.log('Response handling success.'); handleSuccess(html);}

	// recursive shit. but important this is a callback for itself so it waits for the http request to be processed
	if (gameSerialConst[0] < 4) {
		data.getFromUrl(gameUrl.byYearAndGame(year, makeGameNum(gameSerialConst)), responseHandler);
	} else {
		return console.log('finished with the games you ordere');
	}
}

// Do the actual gettering. 
// data.getFromUrl(exampleUrl, responseHandler); // Turn this on if you want dat live shi. 
// data.getFromFile(exampleFile, responseHandler);
data.getFromUrl(gameUrl.byYearAndGame(year, makeGameNum(gameSerialConst)), responseHandler);




