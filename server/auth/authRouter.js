var authCtrl = require('./userCtrl.js');

module.exports = function(app) {
  // Still need to add specific method to call for each route
  // app.get('', authCtrl.doThis())

  // req: To be decided
  // res: To be decided
  app.get('/facebook');

  // req: To be decided
  // res: To be decided
  app.post('/facebook');

};
