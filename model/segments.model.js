Segments = new Mongo.Collection('segments');

Segments.allow({
  insert: function(userId, segment) {
    return true;
  },
  update: function(userId, segment, fields, modifier) {
    return true;
  },
  remove: function(userId, segment) {
    return true;
  }
});
