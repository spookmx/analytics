'use strict'

Meteor.publish('languages', function(options) {

  Counts.publish(this, 'numberOfPages', Languages.find(), {noReady: true});
  return Languages.find();
});
