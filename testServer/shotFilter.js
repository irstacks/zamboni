var _ = require('underscore');

// test function for server side filtering of shot events given
// given a raw gameJson object -- exploratory purposes only

module.exports = {
  filterShots: function(gameJson){

    // var game = JSON.parse(gameJson);
    var events = gameJson.events;
    var shotEvents = ["SHOT", "BLOCK", "MISS", "GOAL"];
    return _.select(events, function(event){
      return _.includes(shotEvents, event.Event);
    });
  },

  // this should take in an array output from filterShots and parse
  // it into 2 datasets by team containing elements of the form:
  // [<int: time elapsed>, <int: shot total>]
  parseShots: function(shotsArray){
    var homeTeam;
    var awayTeam;
    var homeTotal = 0;
    var awayTotal = 0;
    var homeTeamShots = [[0, 0]];
    var awayTeamShots = [[0, 0]];
    console.log(shotsArray[0].Description.slice(0,3));
    _.each(shotsArray, function(el, idx, list){
      console.log(el["#"]);
      console.log(typeof el["Description"]);
      // if(!homeTeam){
      //   homeTeam = teamName
      // }
      // if(homeTeam && homeTeam !== teamName){
      //   awayTeam = teamName;
      // }


      // if(el.Description.slice(0, 3) == homeTeam){
      //   if(el.Event != "BLOCK"){
      //     homeTotal += 1;
      //     homeTeamShots.push([el.timeElapsed, homeTotal]);
      //   } else {
      //     awayTotal += 1;
      //     awayTeamShots.push([el.timeElapsed, awayTotal]);
      //   }
      // } else {
      //   if(el.Event != "BLOCK"){
      //     awayTotal += 1;
      //     awayTeamShots.push([el.timeElapsed, awayTotal]);
      //   } else {
      //     homeTotal += 1;
      //     homeTeamShots.push([el.timeElapsed, homeTotal]);
      //   }
      // }
    });
    return {home: homeTeamShots, away: awayTeamShots};
  }
}
