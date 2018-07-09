'use strict';

var express = require('express'),
    jest = require('jest'),
    nodeFoursquare = require('./../node-foursquare');


require('dotenv').config();

var config = {
  foursquare: {
    mode: 'foursquare',
    version: process.env.VERSION
  },
  secrets: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUrl: process.env.REDIRECT_URL
  }
},
    Foursquare = nodeFoursquare(config),
    app = express();

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

  var runCLI = jest.runCLI;

  runCLI({}, [__dirname]).then(function () {
    process.exit();
  });
});

app.listen(3000, function () {
  var spawn = require('child_process').spawn,
      casper = spawn('npm', ['run', 'test-casper']);

  casper.stdout.pipe(process.stdout);

  casper.on('error', function () {
    app.close();
  });

  casper.on('close', function () {
    app.close();
  });
});