Meteor.startup(function() {
  Languages._ensureIndex({ adobeID: "text" });
});
