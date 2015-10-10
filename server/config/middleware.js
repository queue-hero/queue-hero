var bodyParser = require('body-parser');
var cors = require('cors');
var fbSessions = require('./fbSessions.js');
var twilioNotifications = require('../Twilio/twilioNotifications.js');
var accountSid = 'AC09e0bdb9b277603f113a06390620196a';
var authToken = "fe1aba99308ed506d126b80310f92f55";
//var client = require('twilio')(accountSid, authToken);
var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);


function welcomeSms(phonenumber) {
  client.messages.create({
      to: "+1" + phonenumber,
      from: "+12057917998",
      body: "Ahoy from Qhero! Welcome to San Francisco's Queueless adventure!<3"
  }, function(err, message) {
      console.log(err, message.sid);
      // process.stdout.write(message.sid);
  });
  function InstructionsSms() {
    client.messages.create({
        to: "+1" + phonenumber,
        from: "+12057917998",
        body: "Queue Hero would only send you SMS when one of your request gets picked by a Hero. Have Fun!"
    }, function(err, message) {
        console.log(err, message.sid);
    });
  }
  setTimeout(InstructionsSms, 500000);
}

welcomeSms('6692269013');

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

  // Mount middleware to notify Twilio of errors
  app.use(twilioNotifications.notifyOnError);

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
