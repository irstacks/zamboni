var _ = require('underscore');

// test function for server side filtering of shot events given
// given a raw gameJson object -- exploratory purposes only

module.exports = function(gameJson){

  // var game = JSON.parse(gameJson);
  var events = gameJson.events;
  var shotEvents = ["SHOT", "BLOCK", "MISS", "GOAL"];
  return shotEvents = _.select(events, function(event){
    return _.includes(shotEvents, event.Event);
  });
}
