Meteor.startup(function() {
  Keywords._ensureIndex({ adobeID: "text"});
});
