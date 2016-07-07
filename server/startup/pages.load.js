Meteor.startup(function() {
  Pages._ensureIndex({ "name": "text"});
});
