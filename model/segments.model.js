Segments = new Mongo.Collection('segments');

Segments.allow({
  insert: function(userId, segment) {
    return userId;
  },
  update: function(userId, segment, fields, modifier) {
    return userId;
  },
  remove: function(userId, segment) {
    return userId;
  }
});