var data = require('./data.js');
var fs = require('fs-extra');
var parseable = require('./parseable.js');
var gameUrl = require('./url-maker.js');
var log = require ('./log.js');
var util = require('util');
var chalk = require('chalk');


// var exampleUrl = 'http://www.nhl.com/scores/htmlreports/20152016/PL010003.HTM';
// var url404 = 'http://www.nhl.com/scores/htmlreports/20152016/PL090003.HTM';
// var exampleFile = './testStorage/test-input.html';

// see ./leftoff for latest resource. 
// All you need to do to keep growing the library is his node app.js
var year;
var gameSerialConst = []; // from the beginning. pre season, i think
var haveFailed = 0;
var freyaTick = 0;
var freyaMax = 3;

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
	// console.log('Making game num', zeroPad(gameSerial[0]) + zeroPad(gameSerial[1]) + zeroPad(gameSerial[2]));
	return zeroPad(gameSerial[0]) + zeroPad(gameSerial[1]) + zeroPad(gameSerial[2]);
}

function incrementSuccess() {
	console.log(chalk.green('Incrementing success from ', util.inspect(gameSerialConst)));
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
	console.log(chalk.red('Incrementing failure from ', util.inspect(gameSerialConst)));

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
	console.log(chalk.white.bgRed('Handling 404'));
	var failOutFolder = './failOut/' + year.toString() + (year + 1).toString() + '/';
	var whereToSave = failOutFolder + makeGameNum(gameSerialConst).toString() + '.txt';
	data.saveToFile(whereToSave, "404");
	incrementFailure();
}

// Parse response HTML for game data.
function handleSuccess(html) {
	console.log(chalk.green.bgWhite('Handling success'));
	var dataOutFolder = './dataOut/' + year.toString() + (year + 1).toString() + '/';
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
	freyaTick++;

	if (html === 404) { handle404(); }
	else { handleSuccess(html); }
	
	if (freyaTick < freyaMax) {
	// recursive shit. but important this is a callback for itself so it waits for the http request to be processed
		if (gameSerialConst[0] < 3) {

			// save progress to ./leftoff.json so we don't have to repeat ourselves in case of interruption
			var saveMe = JSON.stringify({year: year, gameSerial: gameSerialConst});
			data.saveToFile('./leftoff.json', saveMe, data.getFromUrl(gameUrl.byYearAndGame(year, makeGameNum(gameSerialConst)), responseHandler));
	
		// Move a year earlier unless arbitrary stop. 
		} else if (year > 2007) {

			year = year-1;
			gameSerialConst = [1,0,1];

			// make sure we got the yearly folders in there
			var yearsfolder = year.toString() + (year + 1).toString();
			fs.ensureDirSync('./dataOut/' + yearsfolder);
			fs.ensureDirSync('./failOut/' + yearsfolder);

			var saveMe = JSON.stringify({year: year, gameSerial: gameSerialConst});
			data.saveToFile('./leftoff.json', saveMe, data.getFromUrl(gameUrl.byYearAndGame(year, makeGameNum(gameSerialConst)), responseHandler));
			return console.log('Finished with the games you ordered.');
	
		// In the name of love, stop. 
		} else {
			var saveMe = JSON.stringify({year: year-1, gameSerial: [1,0,1]});
			data.saveToFile('./leftoff.json', saveMe);
			return console.log('Finished with the games you ordered.');
		}

	} else {
		var saveMe = JSON.stringify({year: year, gameSerial: gameSerialConst});
		data.saveToFile('./leftoff.json', saveMe);
		return console.log('Finished with the games you ordered.');
	}	
}

// Do the actual gettering. 
// data.getFromUrl(exampleUrl, responseHandler); // Turn this on if you want dat live shi. 
// data.getFromFile(exampleFile, responseHandler);
data.getFromFile('./leftoff.json', function(body) {
	gameSerialConst = JSON.parse(body).gameSerial;
	year = JSON.parse(body).year;
	data.getFromUrl(gameUrl.byYearAndGame(year, makeGameNum(gameSerialConst)), responseHandler);	
});
	






