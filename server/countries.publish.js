'use strict'

Meteor.publish('countries', function(options) {

  Counts.publish(this, 'numberOfPages', Countries.find(), {noReady: true});
  return Countries.find();
});
