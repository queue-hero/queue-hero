var http = require('http');
var express = require('express');
var app = express();
var port = 3000;

app.use(express.static(__dirname + './../client'));

middleware(app, express);

app.listen(port, function() {
  console.log('Listening on port', port);
});

module.exports = app;
