var ChartBuilder = function(){
  console.log("ChartBuilder initialized");
}

ChartBuilder.prototype.build = function(){
  $.ajax({
    type: 'GET',
    url: '/testShots',
    success: function(data, status) {
      $('.some-div').html(data[0].Description);
    }
  })
}
