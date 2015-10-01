var requesterCtrl = require('./requesterCtrl.js');

module.exports = function(app) {

  // Still need to add specific method to call for each route
  // app.get('/location', requesterCtrl.doThis())

  // req: nav. location
  // res: map and location options)
  app.get('/task');
  // req: obj with order details
  // res: 201 or error
  app.post('/task');

  // req: order received + rating, queueheroId and requesterId
  // res: 201 or error
  app.post('/order');
};
