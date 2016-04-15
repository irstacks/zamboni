var cheerio = require('cheerio'); // for parsing html like jquery
var fs = require('fs-extra'); // we'll write the output data back to a nice file for looking at
var util = require('util'); // for inspecting objects on logging and debuggery
var merge = require('merge'); // conveniently merge objects
require('./log.js'); // for easy logging


/**
 * Returns array of game events. 
 * @param  {String} html  HTML string in body of http response. 
 * @return {Array}      Game events.
 */
exports.playByPlay = function(html) {

	var $ = cheerio.load(html);

	/**
	 * Output data to pg or wherever later.
	 * @type {Array}
	 */
	var outputEvents = [];
	if ($('table').length < 1) return outputEvents; // There is no data. Like 20142015/010002. 


	// Get descriptive metadata.
	
	/**
	 * Holds data labels.
	 * @type {Array}
	 */
	var metadata = []; 

	// Traverse to first row with relevant data.
	var metadataRow = $('table.tablewidth').first().children('tr').eq(2);
	// Single out table data points. 
	var metadataPoints = metadataRow.children('td');

	/**
	 * Make array of metadata labels.
	 * @param  {Number} i     index
	 * @param  {cheerio} elem   Cheerio elem.	
	 * @return {void}  Pushes to metadata[].
	 * 	// => [ '#',
		   // 'Per',
		   // 'Str',
		   // 'Time:ElapsedGame',
		   // 'Event',
		   // 'Description',
		   // 'FLA On Ice',
		   // 'NSH On Ice' ]
	 */
	metadataPoints.each(function(i, elem) {
		metadata.push($(this).text());
	});


	// Handle the actual puck events.
	
	/**
	 * All puck events are classed as 'evenColor', ie <tr class="evenColor">...</tr> 
	 * @type {cheerio}
	 */
	var puckEvents = $('.evenColor');

	/**
	 * For all events we'll create an object and push it to outputEvents. 
	 * The object properties will depend on metadata.
	 * @param  {Number} i     index
	 * @param  {cheerio} elem  Cheerio element. 
	 * @return {void}  Pushes to outputEvents array. 
	 */
	puckEvents.each(function perEvent(i, elem) {
	
		/**
		 * Stringy raw data points. 
		 * ie Columns in the rows of puck events. 
		 * @type {Array}
		 */
		var dataPoints = $(this).children('td');

		// check that metadata and data meet the barest minimum of compatbility.
		if (dataPoints.length !== metadata.length) return log('Metadata and data dont match length');


		// The dataPoints hold flast data and nested-table data.
		// The flat data is simple stats. 
		// The nested tables are players on the ice (position, number) for each team. 

		/**
		 * First we'll get the flat data. Low hanging fruit and that.
		 * Holds depth=1 puck events. (Not that table-in-a-table shit).
		 * @type {Object}
		 */		
		var puckEventStats = {};

		/**
		 * Then we'll get the damn nested tables data which is teams' players.
		 * @type {Object}
		 */
		var teamStats = {};

		
		// Only for the td's WITHOUT tables inside of them.
		dataPoints.not(function(i, elem) {
			return $(this).children('table').length > 0;
		}).each(function(i, elem) {

				// The time one separates elapsed and remaining with a <br>. 
				if ($(this).children('br').length > 0) {

					puckEventStats['timeElapsed'] = $(this).html().split('<br>')[0];
					puckEventStats['timeRemaining'] = $(this).html().split('<br>')[1];

				} else {

					// Lookup metadata label.
					var label = metadata[i];
					puckEventStats[label] = $(this).text();		
				}
			});
			// log(util.inspect(puckEventStats));
		

		// Then, we get the team stats. The nested tables. 

		// Only for the td's WITH tables inside of them. 
		// There will be two of these -- one for each team. 
		dataPoints.filter(function(i, elem) {
			return $(this).children('table').length > 0;
		}).each(function(j, elem) { // nb this elem is a <td> with many many nested tables inside
				
				// Team for us to push players into. 
				var team = [];

				// Each player/team.
				// Instead of traversing tables, go to straight to unique identifier for there being 
				// player data. 
				var players = $(this).find('font');

				players.each(function(i, elem) {
					var player = {};
					player['name'] = $(this).attr('title');
					player['number'] = $(this).text();

					// TODO: Traverse to get the position. 

					team.push(player);
				});
				
				// TODO: You could do something better here for referencing metadata. 
				// This is a pretty dirty way. 
				if (j === 0) {
					teamStats[metadata[6]] = team;
				} else {
					teamStats[metadata[7]] = team;
				}

			});
		
		// log(util.inspect(puckEventStats));
		// log(util.inspect(teamStats));
		var theEvent = merge(puckEventStats, teamStats);
		// log(util.inspect(theEvent));

		outputEvents.push(theEvent);

	}); // end events.each


	// Return JSON array. 
	// log(util.inspect(outputEvents));
	return outputEvents; 
}



exports.jumbotron = function(html) {
	
	var $ = cheerio.load(html);
	var visitorTable = $('table#Visitor');
	var homeTable = $('table#Home');
	var gameInfoTable = $('table#GameInfo');

	// Save erroring in case there is just nothing there, but not a 404. 
	var returnableSafe = {
		gameData: {},
		teamData: {},
		parseTeamScoreboard: parseTeamScoreboard,
		parseMetadata: parseMetadata
	};
	if ($('table').length < 1) return returnableSafe;


	/**
	 * Get the middle stuff. 
	 * @param  {cheerio table == Object} table  The middling table.
	 * @return {Object} md       Includes date, attendance+location, start and end times, game #
	 */
	var parseMetadata = function(table) {
		var md = {};

		md.date = table.children('tr').eq(3).children('td').first().text();
		md.assesInSeats = table.children('tr').eq(4).children('td').first().text();
		md.clocks = table.children('tr').eq(5).children('td').first().text();
		md.gameNum = table.children('tr').eq(6).children('td').first().text();

		return md;
	};


	/**
	 * Home and visitor in the scoreboard should be symmetrical. 
	 * @param {cheerio table == Object} table Table with one team's data.
	 * @return {Object} team  Includes score, team name, imageurl
	 */
	var parseTeamScoreboard = function(table) {
		var tm = {};
		tm.name = table.find('td').last().html().split('<br>')[0];
		tm.games = table.find('td').last().html().split('<br>')[1];
		
		// find image by team name
		tm.imageUrl = table.find('img[alt="'+tm.name+'"]').attr('src');
		// lookat dat sloppy inline css.  
		tm.score = table.find('td[style="font-size: 40px;font-weight:bold"]').first().text();

		return tm;
	};


	// Parse em an set em. 
	var gameData = parseMetadata(gameInfoTable);
	var teamData = {
		home: parseTeamScoreboard(homeTable),
		visitor: parseTeamScoreboard(visitorTable)
	};

	return {
		gameData: gameData,
		teamData: teamData,

		// Return the function just in case you need em on the fly.
		// As far as modularization goes, this is approach is probably 
		// more extensible in the long haul.
		parseTeamScoreboard: parseTeamScoreboard,
		parseMetadata: parseMetadata
	};
}







