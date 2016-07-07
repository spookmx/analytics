'use strict'

Meteor.publish('pages', function(options) {

  Counts.publish(this, 'numberOfPages', Pages.find(), {noReady: true});
  return Pages.find();
});
