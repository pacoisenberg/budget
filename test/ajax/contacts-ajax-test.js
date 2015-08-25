var should = require('should');
var request = require('supertest');
var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var app = require('../../lib/app');
var repo = require('../../lib/repo');


var listenPort = 3001;
var ajaxBaseUrl = 'http://localhost:' + listenPort + '/ajax';
var mongoUrl = 'mongodb://localhost:27017/test_clues?connectTimeoutMS=5000';

var server;

/////////////////////////////////////////////////////
// Initialization Helper Functions
/////////////////////////////////////////////////////

function startServer(mongoUrl, listenPort, done) {
  repo.init(mongoUrl, function (err) {
    if (err)
      return done(err);
    server = app.listen(listenPort, function () {
      console.log('Test server listening at port %s', listenPort);
      done();
    });
  });
}

function stopServer(done) {
  server.close(function () {
    log.debug('Test server shutdown.');
    done();
  });
}

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

/////////////////////////////////////////////////////
// Ajax Request Helper Functions
/////////////////////////////////////////////////////


var expectGetAllContactsSuccess = function (count, next) {
  request(ajaxBaseUrl)
    .get('/contacts/')
    .accept('application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      should.not.exist(err);
      var contacts = res.body.should.have.property('contacts').obj;
      if (count >= 0)
        should(contacts.length).be.equal(count);
      should.exist(contacts);
      next(contacts);
    });
};


/////////////////////////////////////////////////////
// Test Cases
/////////////////////////////////////////////////////

describe('Contacts Repository', function () {

  before(function (done) {
    dropDB(mongoUrl, function (err) {
      if (err)
        return done(err);
      startServer(mongoUrl, listenPort, function(err) {
        if (err)
          return done(err);
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

/////////////////////////////////////////////////////
  describe('Get All Contacts method', function () {
/////////////////////////////////////////////////////

    it('should get all contacts', function (done) {
      var now = new Date();
      var name = 'William Camferbell';
      var email = 'william@camferbell.com';
      repo.contacts.create(name, email, function (err, actual) {
        should.not.exist(err);
        expectGetAllContactsSuccess(1, function (contacts) {
          var actual = contacts[0];
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
