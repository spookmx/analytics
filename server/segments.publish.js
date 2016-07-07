'use strict'

Meteor.publish('segments', function(options, searchString) {
  var where = {
    'name': {
      '$regex': '.*' + (searchString || '') + '.*',
      '$options': 'i'
    }
  };
  Counts.publish(this, 'numberOfSegments', Segments.find(where), {noReady: true});
  return Segments.find(where, options);
});
