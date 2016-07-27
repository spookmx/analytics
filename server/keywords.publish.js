'use strict'

Meteor.publish('keywords', function(options) {

  Counts.publish(this, 'numberOfPages', Keywords.find(), {noReady: true});
  return Keywords.find();
});
