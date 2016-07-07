Meteor.startup(function() {
  if(Segments.find().count() === 0) {
    var segments = [
      {
        'name': 'segment 1'
      },
      {
        'name': 'segment 2'
      }
    ];
    segments.forEach(function(segment) {
      Segments.insert(segment);
    });
  }
});