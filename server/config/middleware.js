var bodyParser = require('body-parser');
var cors = require('cors');
var fbSessions = require('./fbSessions.js');



module.exports = function(app, express) {
  var authRouter = express.Router();
  var userRouter = express.Router();
  var heroRouter = express.Router();
  var requesterRouter = express.Router();
  var transactionRouter = express.Router();

  // Middleware to parse request body
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(cors());

  //initializes client sessions and facebook login config
  fbSessions.initialize(app);

  // server expects url of 'auth/facebook' for facebook signin
  // authRouter to have routes for all authentications
  // i.e. facebook, github, or our own
  app.use('/auth', authRouter);

  // signup, choice, profile uses same router
  // signup make POST request
  // choice & profile both make GET request for user data
  app.use('/signup', userRouter);

  //restrict middleware function is added to all routes requiring authentication
  app.use('/choice', fbSessions.restrict, userRouter);
  app.use('/profile', fbSessions.restrict, userRouter);

  // all routes for hero set in heroRouter
  app.use('/hero', fbSessions.restrict, heroRouter);

  // all routes for requester set in requesterRouter
  app.use('/requester', fbSessions.restrict, requesterRouter);

  // all routes for transactions set in transactionRouter
  app.use('/transactions', transactionRouter);

  require('../auth/authRouter.js')(authRouter);
  require('../users/userRouter.js')(userRouter);
  require('../heroes/heroRouter.js')(heroRouter);
  require('../requesters/requesterRouter.js')(requesterRouter);
  require('../transactions/transactionRouter.js')(transactionRouter);
};
