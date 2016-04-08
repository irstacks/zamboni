var requestable = require('./requestable.js'); // for getting dat data
var cheerio = require('cheerio'); // for parsing html like jquery
var util = require('util'); // for inspecting objects
var merge = require('merge'); // conveniently merge objects
var fs = require('fs'); // we'll write the output data back to a nice file for looking at


var exampleUrl = 'http://www.nhl.com/scores/htmlreports/20152016/PL010003.HTM';
var exampleFile = './localStore/test';


function log(thingToLog) {
	console.log(thingToLog);
}


function parseData(html) {

	var $ = cheerio.load(html);

	/**
	 * Output data to pg or wherever later.
	 * @type {Array}
	 */
	var output = [];


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
	 * All events. 
	 * @type {cheerio}
	 */
	var events = $('.evenColor');

	/**
	 * For all events we'll create an object and push it to output. 
	 * The object properties will depend on metadata.
	 * @param  {Number} i     index
	 * @param  {cheerio} elem  Cheerio element. 
	 * @return {void}  Pushes to output array. 
	 */
	events.each(function perEvent(i, elem) {
	
		/**
		 * Stringy raw data points. 
		 * @type {Array}
		 */
		var dataPoints = $(this).children('td');
			// check that metadata and data meet the barest minimum of compatbility.
			if (dataPoints.length !== metadata.length) return log('Metadata and data dont match length');


		// The dataPoints hold flast data and nested-table data.
		// The flat data is simple stats. 
		// The nested tables are players on the ice (position, number) for each team. 

		/**
		 * Holds depth=1 puck events. (Not that table-in-a-table shit).
		 * @type {Object}
		 */		
		var puckEventStats = {};
		var teamStats = {};


		// First we'll get the flat data. Low hanging fruit and that.
		
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
				// teamStats[j] = team;
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

		output.push(theEvent);

	}); // end events.each


	// Return JSON array. 
	// log(util.inspect(output));
	return output; 
}

function handleHTML(html) {
	var o = parseData(html);
	var whereToSave = './localStore/output-test.json';
	fs.writeFile(whereToSave, JSON.stringify(o), function(err) {
		if (err) {
			return log(err);
		}
		log('Saved output! @ ' + whereToSave);
	});
}

requestable.locally(exampleFile, handleHTML);





