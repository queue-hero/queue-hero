var userCtrl = require('./userCtrl.js');

module.exports = function(app) {
  // Still need to add specific method to call for each route
  // app.get('', userrCtrl.doThis())

  // req: username from token
  // res: userdata
  app.get('');

  // req: object with signup details
  // res: 201 or error
  app.post('');
};
