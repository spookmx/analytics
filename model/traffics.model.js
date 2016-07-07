Traffics = new Mongo.Collection('traffics');

Traffics.allow({
  insert: function(userId, traffic) {
    return true;
  },
  update: function(userId, traffic, fields, modifier) {
    return true;
  },
  remove: function(userId, traffic) {
    return true;
  }
});