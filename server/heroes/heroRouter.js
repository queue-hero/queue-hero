var heroCtrl = require('./heroCtrl.js');

module.exports = function (app) {
  // need to add specific method to call for each route
  // app.get('/location', heroCtrl.doThis())
  app.get('/location');
  app.post('/location');
  app.get('/task');
  app.post('/task');
  app.post('/order');
};
