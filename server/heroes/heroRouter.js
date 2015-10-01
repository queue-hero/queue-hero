var heroCtrl = require('./heroCtrl.js');

module.exports = function (app) {
  // Still need to add specific method to call for each route
  // app.get('/location', heroCtrl.doThis())

  // req: browser nav. location
  // res: map and location options
  app.get('/location');
  // req: option chosen / location of hero
  // res: 201 or error
  app.post('/location');

  // req: browser nav. location
  // map and location options
  app.get('/task');
  // req: obj with order details from the controller
  // res: 201 or error
  app.post('/task');

  // req: Polling
  // res: Polling
  app.post('/order');

  // Need to resolve how to direct two different POSTS from same url
  // req: order received + rating, queuehero id and requester id
  // res: 201 or error
  app.post('/order');
};
