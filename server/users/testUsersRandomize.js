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
  "vendorYelpId": "japacurry-truck-san-francisco",
  "vendor": "JapaCurry Truck",
  "meetingAddress": "Financial District San Francisco, CA 94103",
  "lat": 37.7876609372076,
  "long": -122.400474864214,
}, {
  "vendorYelpId": "the-store-on-the-corner-san-francisco",
  "vendor": "The Store On the Corner",
  "meetingAddress": "121 New Montgomery St Financial District San Francisco, CA 94105",
  "lat": 37.7871788604614,
  "long": -122.399970236304,
}, {
  "vendorYelpId": "cafe-madeleine-san-francisco-3",
  "vendor": "Cafe Madeleine",
  "meetingAddress": "149 New Montgomery St Financial District San Francisco, CA 94105",
  "lat": 37.7869478294579,
  "long": -122.399665622613,
}, {
  "vendorYelpId": "señor-sisig-san-francisco-3",
  "vendor": "Señor Sisig",
  "meetingAddress": "Financial District San Francisco, CA 94115",
  "lat": 37.7876319280557,
  "long": -122.399411585167,
}, {
  "vendorYelpId": "the-dosa-brothers-san-francisco-4",
  "vendor": "The Dosa Brothers",
  "meetingAddress": "598 Market St Financial District San Francisco, CA 94104",
  "lat": 37.7889748,
  "long": -122.4019547,
}, {
  "vendorYelpId": "specialtys-cafe-and-bakery-san-francisco-12",
  "vendor": "Specialty's Cafe & Bakery",
  "meetingAddress": "1 Post St Financial District San Francisco, CA 94104",
  "lat": 37.7887688,
  "long": -122.4025726,
}, {
  "vendorYelpId": "del-popolo-san-francisco",
  "vendor": "Del Popolo",
  "meetingAddress": "Financial District San Francisco, CA",
  "lat": 37.7858111475237,
  "long": -122.402782738209,
}, {
  "vendorYelpId": "sausalito-cafe-san-francisco-3",
  "vendor": "Sausalito Cafe",
  "meetingAddress": "100 1st St Financial District San Francisco, CA 94105",
  "lat": 37.7893252,
  "long": -122.3975863,
}, {
  "vendorYelpId": "henrys-cafe-and-deli-san-francisco-2",
  "vendor": "Henry's Cafe & Deli",
  "meetingAddress": "111 Sutter St Financial District San Francisco, CA 94104",
  "lat": 37.7897605895996,
  "long": -122.402526855469,
}, {
  "vendorYelpId": "dus-sandwich-san-francisco",
  "vendor": "Du's Sandwich",
  "meetingAddress": "1st Sansome St Financial District San Francisco, CA 94103",
  "lat": 37.7906930175004,
  "long": -122.400562652988,
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
  'lindsey': '300303',
  'max': '94959532',
  'pat': '11100222',
  'frank': '090909032'
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
var averageRating = [3, 3.5, 4, 4.5, 3.6666];
//not being used, purely for reference
var meetingLocationExamples = {
  mks: [37.787518, -122.399868],
  Far: [38, -123]
};

var status = ['unfulfilled', 'unfulfilled', 'unfulfilled', 'inprogress', 'complete', 'closed'];
var assigned = [true, false, false, false];

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
  user.averageRating = averageRating[_.random(0, averageRating.length - 1)];
  users.push(user);

  var transaction = {};
  var checkin = {};
  transaction.requester = username;
  transaction.meetingTime = Date.now() + 60000 * _.random(30, 45);
  transaction.moneyExchanged = _.random(1, 15);
  transaction.additionalRequests = additionalRequests[_.random(0, additionalRequests.length - 1)];
  checkin.queueHero = username;
  checkin.assigned = assigned[_.random(0, assigned.length - 1)];
  transaction.status = status[_.random(0, status.length - 1)];
  if (transaction.status === 'inprogress' || transaction.status === 'complete') {
    transaction.queueHero = pickRandomUser(username);
  } else {
    transaction.queueHero = undefined;
  }
  var myLocation = validLocations[_.random(0, validLocations.length - 1)];

  if (_.random(0, 4) > 0) {
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
