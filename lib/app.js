var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

// require routes
var contactsHtml = require('./routes/contacts-html');
var contactsAjax = require('./routes/contacts-ajax');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

// configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));

// configure html routes
app.use('/contacts', contactsHtml);

// configure ajax routes
app.use('/ajax/contacts', contactsAjax);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// fall through error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});


module.exports = app;
