var express = require('express');
var router = express.Router();

var repo = require('../repo');

/* GET all contacts */
router.get('/', function(req, res, next) {
  repo.contacts.getAll(function (err, contacts) {
    if (err)
      return next(err);
    res.json({ contacts: contacts });
  });
});

/* Simple example route for displaying POST body */
router.post('/echo', function(req, res, next) {
  console.log('body = %j', req.body);
  res.json(req.body);
});

module.exports = router;
