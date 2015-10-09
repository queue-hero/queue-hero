var userCtrl = require('./userCtrl.js');

module.exports = function(app) {
  // Need to add specific method to call for each route
  // ex. app.get('', userCtrl.doThis)

  // req: username from token
  // res: userdata
  app.get('/', userCtrl.getUserData);
  // req: object with signup details
  // res: 201 or error
  app.post('/', userCtrl.postUserData);

  // req: object with updated profile info
  // res: 201 or error
  app.post('/update', userCtrl.postUserUpdate);


  app.post('/pic/:username', userCtrl.saveProfilePic);

};
