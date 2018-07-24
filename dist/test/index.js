'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _jest = require('jest');

var _jest2 = _interopRequireDefault(_jest);

var _ = require('./../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('babel-polyfill');


require('dotenv').config();

var config = {
  foursquare: {
    version: process.env.VERSION
  },
  secrets: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUrl: process.env.REDIRECT_URL
  }
};

var Foursquare = (0, _2.default)(config);

var app = (0, _express2.default)();

app.get('/', function (req, res) {
  var url = Foursquare.getAuthClientRedirectUrl();
  res.writeHead(303, { location: url });
  res.end();
});

app.get('/callback', function (req, res) {
  var code = req.query.code;
  Foursquare.getAccessToken({
    code
  }, function (error, accessToken) {
    if (error) {
      res.send(`An error was thrown: ${error.message}`);
    } else if (!accessToken) {
      res.send(`No access token was provided`);
    } else {
      res.redirect(`/test?token=${accessToken}`);
    }
  });
});

app.get('/test', function (req, res) {
  var accessToken = req.query.token || '';
  process.env.ACCESS_TOKEN = accessToken;
  var type = `Running Jest tests with${accessToken ? '' : 'out'} Authorization`;

  if (!accessToken) {
    type += ' (tests of API endpoints requiring an access token will not pass)';
  }

  res.send(`<html><title>Refer to Console</title><body>${type}...</body></html>`);

  var runCLI = _jest2.default.runCLI;

  runCLI({}, [__dirname], 'users-test').then(function () {
    process.exit();
  });
});

var server = app.listen(3000, function () {
  var spawn = require('child_process').spawn;
  var casper = spawn('npm', ['run', 'test-casper']);
  casper.stdout.pipe(process.stdout);

  casper.on('error', function () {
    server && server.close();
  });

  casper.on('close', function () {
    server && server.close();
  });
});