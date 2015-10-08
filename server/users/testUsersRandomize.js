var _ = require('underscore');

//things to export
var checkins = [];
var transactions = [];
var users = [];

//has no use, just to see schemas
var CheckinSchema = ['queueHero', 'vendor', 'vendorYelpId', 'meetingLocation, meetingAddress', 'assigned'];
var TransactionSchema = ['queueHero', 'requester', 'item', 'additionalRequests', 'moneyExchanged', 'meetingTime', 'meetingLocation', 'meetingAddress', 'vendor', 'vendorYelpId', 'status'];
var UserSchema = ['username', 'password', 'facebookId', 'profilePhoto', 'firstName', 'lastName', 'phoneNumber', 'cardNumber', 'cvc', 'billingAddress', 'state', 'country', 'ratings'];

//example yelp API output for mks
var validLocations = [{
  "vendorYelpId": "specialtys-cafe-and-bakery-san-francisco-22",
  "vendor": "Specialty's Cafe & Bakery",
  "meetingAddress": "101 New Montgomery St Financial District San Francisco, CA 94105",
  "lat": 37.787351,
  "long": -122.40038
}, {
  "vendorYelpId": "walgreens-san-francisco-113",
  "vendor": "Walgreens",
  "meetingAddress": "116 New Montgomery St Financial District San Francisco, CA 94105",
  "lat": 37.7871832251549,
  "long": -122.400254756212
}, {
  "vendorYelpId": "the-store-on-the-corner-san-francisco",
  "vendor": "The Store On the Corner",
  "meetingAddress": "121 New Montgomery St Financial District San Francisco, CA 94105",
  "lat": 37.7871788604614,
  "long": -122.399970236304
}, {
  "vendorYelpId": "espresso-subito-san-francisco-2",
  "vendor": "Espresso Subito",
  "meetingAddress": "Financial District San Francisco, CA 94105",
  "lat": 37.7880001,
  "long": -122.399838
}, {
  "vendorYelpId": "tart-to-tart-san-francisco-2",
  "vendor": "Tart To Tart",
  "meetingAddress": "90 New Montgomery St Financial District San Francisco, CA 94105",
  "lat": 37.787422,
  "long": -122.400932
}, {
  "vendorYelpId": "red-door-coffee-san-francisco-2",
  "vendor": "Red Door Coffee",
  "meetingAddress": "111 Minna St Financial District San Francisco, CA 94105",
  "lat": 37.787385,
  "long": -122.399547
}, {
  "vendorYelpId": "jamba-juice-san-francisco-11",
  "vendor": "Jamba Juice",
  "meetingAddress": "74 New Montgomery St Financial District San Francisco, CA 94105",
  "lat": 37.787653,
  "long": -122.400984
}, {
  "vendorYelpId": "7-eleven-san-francisco-28",
  "vendor": "7-Eleven",
  "meetingAddress": "644 Mission St Financial District San Francisco, CA 94105",
  "lat": 37.7872086,
  "long": -122.4008958
}, {
  "vendorYelpId": "starbucks-san-francisco-146",
  "vendor": "Starbucks",
  "meetingAddress": "74 New Montgomery St Ste 100 Financial District San Francisco, CA 94105",
  "lat": 37.7876595620531,
  "long": -122.401033937931
}, {
  "vendorYelpId": "special-xtra-2-san-francisco",
  "vendor": "Special Xtra 2",
  "meetingAddress": "138 Minna St Financial District San Francisco, CA 94105",
  "lat": 37.7869317680597,
  "long": -122.400192394853
}];

//"made up" username and fb ID
var pool = {
  'darrin': '324324234',
  'armin': '3059305353',
  'shreeya': '4234234',
  'tatsumi': '90903',
  'jake': '92442',
  'mike': '34535',
  'rachel': '3453543',
  'sarah': '11111',
  'paul': '222222',
  'yomama': '999999',
  'fred': '54644564',
  'george': '8888888',
  'cindy': '4444444',
  'norm': '29292929',
  'lindsey': '300303'
};

//pick random user in "pool" not equal to username parameter
function pickRandomUser(username) {
  var userPool = Object.keys(pool);
  var pickedUser = userPool[_.random(0, userPool.length - 1)];
  if (username !== pickedUser) {
    return pickedUser;
  } else {
    pickRandomUser(username);
  }
}

var item = ['coffee', 'sandwich', 'taco', 'bread', 'frappe', 'milkshake', 'chips'];
var additionalRequests = ['napkins', 'i need it now', 'mmm hungry', 'hold the sauce', 'extra tip if you get there on time'];

//not being used, purely for reference
var meetingLocationExamples = {
  mks: [37.787518, -122.399868],
  Far: [38, -123]
};

var status = ['unfulfilled', 'inprogress', 'complete', 'closed'];
var assigned = [true, false];

//look through each user listed in "pool" object
for (var key in pool) {
  var username = key;
  var facebookId = pool[key];

  var user = {};
  user.username = username;
  user.firstName = username;
  user.lastName = 'smith';
  user.password = 'password';
  user.facebookId = facebookId;
  users.push(user);

  var transaction = {};
  var checkin = {};
  transaction.requester = username;
  transaction.meetingTime = Date.now() + 60000 * _.random(1, 15);
  transaction.moneyExchanged = _.random(1, 15);
  transaction.additionalRequests = additionalRequests[_.random(0, additionalRequests.length - 1)];
  checkin.queueHero = username;
  checkin.assigned = assigned[_.random(0, assigned.length - 1)];
  transaction.status = status[_.random(0, status.length - 1)];
  if (transaction.status === 'inprogress' || 'complete') {
    transaction.queueHero = pickRandomUser(username);
  } else {
    transaction.queueHero = undefined;
  }
  var myLocation = validLocations[_.random(0, validLocations.length - 1)];

  if (_.random(0, 3) > 0) {
    transaction.vendorYelpId = myLocation.vendorYelpId;
    transaction.vendor = myLocation.vendor;
    transaction.meetingAddress = myLocation.meetingAddress;
    transaction.vendorYelpId = myLocation.vendorYelpId;
    transaction.meetingLocation = [myLocation.lat, myLocation.long];
    transaction.item = item[_.random(0, item.length - 1)];

    checkin.vendorYelpId = myLocation.vendorYelpId;
    checkin.vendor = myLocation.vendor;
    checkin.meetingAddress = myLocation.meetingAddress;
    checkin.vendorYelpId = myLocation.vendorYelpId;
    checkin.meetingLocation = [myLocation.lat, myLocation.long];
  } else {
    transaction.vendorYelpId = 'far away bar';
    transaction.vendor = 'far away bar';
    transaction.meetingAddress = '123 far away st';
    transaction.meetingLocation = [38, -123];

    checkin.vendorYelpId = 'far away bar';
    checkin.vendor = 'far away bar';
    checkin.meetingAddress = '123 far away st';
    checkin.meetingLocation = [38, -123];
  }

  transactions.push(transaction);
  checkins.push(checkin);

}


module.exports = {
  testUsers: users,
  testTransactions: transactions,
  testCheckins: checkins
};
