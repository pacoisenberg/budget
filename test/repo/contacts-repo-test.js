var should = require('should');
var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var repo = require('../../lib/repo');


var mongoUrl = 'mongodb://localhost:27017/test_clues?connectTimeoutMS=5000';

function dropDB(mongoUrl, done) {
  MongoClient.connect(mongoUrl, function(err, db) {
    if (err)
      return done(err);
    db.collections(function (err, collections) {
      async.each(collections, function(collection, callback) {
        if (collection.collectionName.indexOf('system') === 0) {
          return callback();
        };
        collection.drop(callback);
      }, done);
    });
  });
}

///////////////////////////////////////////////////
// Test Cases
///////////////////////////////////////////////////

describe('Contacts Repository', function () {

  before(function (done) {
    dropDB(mongoUrl, function (err) {
      if (err)
        return done(err);
      repo.init(mongoUrl, function(err) {
        if (err)
          return done(err);
        console.log('repo created!!!');
        done();
      });
    });
  });

  afterEach(function (done) {
    dropDB(mongoUrl, function (err) {
      if (err)
        return done(err);
      done();
    });
  });


///////////////////////////////////////////////////
  describe('Create Contact method', function () {
///////////////////////////////////////////////////

    it('should create and return a contact', function (done) {
      var now = new Date();
      var name = 'William Camferbell';
      var email = 'william@camferbell.com';
      repo.contacts.create(name, email, function (err, actual) {
        should.not.exist(err);
        should.exist(actual);
        var id = actual.should.have.property('id').obj;
        id.should.have.type('string');
        actual.should.have.property('name', name);
        actual.should.have.property('email', email);
        var createdOn = actual.should.have.property('createdOn');
        var modifiedOn = actual.should.have.property('modifiedOn');
        createdOn.should.not.be.lessThan(now);
        modifiedOn.should.not.be.lessThan(now);
        done();
      });
    });

  });

///////////////////////////////////////////////////
  describe('Get All Contacts method', function () {
///////////////////////////////////////////////////

    it('should get all contacts', function (done) {
      var now = new Date();
      var name = 'William Camferbell';
      var email = 'william@camferbell.com';
      repo.contacts.create(name, email, function (err, actual) {
        should.not.exist(err);
        repo.contacts.getAll(function (err, results) {
          should.not.exist(err);
          should.exist(results);
          console.log(JSON.stringify(results));
          results.length.should.equal(1);
          var actual = results[0];
          var id = actual.should.have.property('id').obj;
          id.should.have.type('string');
          actual.should.have.property('name', name);
          actual.should.have.property('email', email);
          var createdOn = actual.should.have.property('createdOn');
          var modifiedOn = actual.should.have.property('modifiedOn');
          createdOn.should.not.be.lessThan(now);
          modifiedOn.should.not.be.lessThan(now);
          done();
        });
      });
    });

  });

});
