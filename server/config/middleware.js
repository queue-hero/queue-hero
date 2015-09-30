var bodyParser = require('body-parser');

module.exports = function (app, express) {
  var userRouter = express.Router();
  var locationRouter = express.Router();
  var transactionRouter = express.Router();
  var checkinRouter = express.Router();
  var arbitrationRouter = express.Router();
  var heroeRouter = express.Router();
  var requesterRouter = express.Router();

  // Middleware to parse request body
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  // Render client/index.html upon receiving request
  app.use(express.static(__dirname + './../../client'));

  // need authRouter for facebook login
  //app.use('/signup', userRouter);
  app.use('/choice', userRouter);
  app.use('/profile', userRouter);
  app.use('/hero', heroRouter);
  app.use('/requester', requesterRouter);

  require('../users/userRouter.js')(userRouter);
  require('../heroes/heroRouter.js')(heroRouter);
  require('../requesters/requesterRouter.js')(requesterRouter);
};
