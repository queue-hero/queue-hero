var requesterCtrl = require('./requesterCtrl.js');

module.exports = function (app) {
  // need to add specific method to call for each route
  // app.get('/location', requesterCtrl.doThis())
  app.get('/task');
  app.post('/task');
  app.get('/order');
  app.post('/order');
};
