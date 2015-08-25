var util = require('util');

function transmuteContact(doc) {
  return {
    id: doc._id.toHexString(),
    name: doc.name,
    email: doc.email,
    createdOn: doc.createdOn,
    modifiedOn: doc.modifiedOn
  };
}

function Contacts(db) {

  /* If this constructor is called without the 'new' operator, 'this' points
   * to the global object. Log a warning and call it correctly. */
  if (false === (this instanceof Contacts)) {
    console.warn('Warning: Contacts constructor called without "new" operator');
    return new Contacts(db);
  };

  // initialize vars
  var self = this;
  var contacts = db.collection('contacts');

  ///////////////////////////////////////////
  // function definitions
  ///////////////////////////////////////////

  this.create = function (name, email, callback) {
    var now = new Date();
    var doc = {
      name: name,
      email: email,
      createdOn: now,
      modifiedOn: now
    };
    contacts.insert(doc, function (err, inserted) {
      if (err)
        return callback(err);
      callback(null, transmuteContact(doc));
    });
  };

  this.getAll = function (callback) {
    contacts.find({}).toArray(function (err, docs) {
      if (err)
        return callback(err);
      callback(null, docs.map(transmuteContact));
    });
  };

}

module.exports.Contacts = Contacts;
