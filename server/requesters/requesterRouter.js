var requesterCtrl = require('./requesterCtrl.js');

module.exports = function(app) {
  // need to add specific method to call for each route
  // app.get('/location', requesterCtrl.doThis())

  // req: nav. location
  // res: map and location options)
  app.get('/task', requesterCtrl.getLocationOptions);

  // req: obj with order details
  // res: 201 or error
  app.post('/task', requesterCtrl.createTransaction);

  // req: Polling. setInterval poll to server until match found
  // res: Polling. return false until match found
  app.get('/order/details', requesterCtrl.checkOrderAccepted);


  app.post('/order/details/cancel', requesterCtrl.cancelTransaction);

  // req: obj with source and destination
  // res: geojson object with directions information
  app.get('/order/directions', requesterCtrl.getDirections);

  // req: order received
  // res: 201 or error
  app.post('/order/complete', requesterCtrl.fulfillTransaction);

  app.post('/order/rate', requesterCtrl.rateHero);
};
