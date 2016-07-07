Pages = new Mongo.Collection('pages');

Pages.allow({
  insert: function(userId, page) {
    return true;
  },
  update: function(userId, page, fields, modifier) {
    return true;
  },
  remove: function(userId, page) {
    return true;
  }
});
