Meteor.startup(function() {
  Countries._ensureIndex({ adobeID: "text"});
});
