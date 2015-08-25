var repo = require('./lib/repo');
var app = require('./lib/app');

  // TODO: move to config file
var config = {
  mongoUrl: 'mongodb://localhost:27017/clues',
  listenPort: 3000
};

repo.init(config.mongoUrl, function (err) {
  if (err)
    throw err;
  app.listen(config.listenPort, function () {
    console.log('Server listening at port %s', config.listenPort);
  });
});
