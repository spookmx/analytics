Meteor.startup(function() {
  if(Traffics.find().count() === 0) {
    var traffics = [
      {
        'name': 'traffic 1'
      },
      {
        'name': 'traffic 2'
      }
    ];
    traffics.forEach(function(traffic) {
      Traffics.insert(traffic);
    });
  }
});