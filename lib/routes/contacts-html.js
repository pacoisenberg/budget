var express = require('express');
var router = express.Router();

var repo = require('../repo');

/* GET all contacts */
router.get('/', function(req, res, next) {
  repo.contacts.getAll(function (err, contacts) {
    if (err)
      return next(err);
    res.render('contacts/list', { contacts: contacts, title: 'All Contacts' });
  });
});

/* GET all contacts via AJAX */
router.get('/list-ajax', function(req, res, next) {
  res.render('contacts/list-ajax', { title: 'All Contacts Via Ajax' });
});

module.exports = router;
