var authCtrl = require('./authCtrl.js');


module.exports = function(app) {
  // Still need to add specific method to call for each route
  // app.get('', authCtrl.doThis())

  app.get('/facebook', authCtrl.initialLogin);

  app.get('/facebook/callback', authCtrl.redirect, authCtrl.findUser);
};
