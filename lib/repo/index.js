var MongoClient = require('mongodb').MongoClient;
var Contacts = require('./contacts-repo').Contacts;

var repo = {};

repo.init = function (mongoUrl, done) {
  MongoClient.connect(mongoUrl, function(err, db) {
    if (err)
      return done(err, null);

    repo.db = db;
    repo.contacts = new Contacts(db);

    done();
  });
};

module.exports = repo;
