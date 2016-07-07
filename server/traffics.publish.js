'use strict'

Meteor.publish('traffics', function(options, searchString) {
  var where = {
    'name': {
      '$regex': '.*' + (searchString || '') + '.*',
      '$options': 'i'
    }
  };
  Counts.publish(this, 'numberOfTraffics', Traffics.find(where), {noReady: true});
  return Traffics.find(where, options);
});
