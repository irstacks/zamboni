// Constants (for now). 
var baseUrl = 'http://www.nhl.com/scores/htmlreports/';
// var startYear = 2015;


/**
 * Returns incremented+concatenated year string given start year. 
 * @param  {Integer} startYear  ie 2015
 * @return {String}           ie '20152016'
 */
function yearsString (startYear) {
	var nextYear = startYear + 1;
	return startYear.toString()+nextYear.toString();
}


/**
 * Makes url string. Is based on baseUrl constant above. 
 * @param  {Integer} year    Starting year for season, ie 2015
 * @param  {Integer} gameNum Six digits, ie 010003
 * @return {String}         Queryable URL. 
 */
exports.byYearAndGame = function(year, gameNum) {
	return baseUrl + yearsString(year) + '/' + 'PL' + gameNum + ".HTM";
};



