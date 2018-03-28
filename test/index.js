/* @flow */

const express = require('express');
const jest = require('jest');
const nodeFoursquare = require('./../dist/node-foursquare');
const config = {
  foursquare: {
    mode: 'foursquare',
    version: process.env.VERSION,
  },
  secrets: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUrl: process.env.REDIRECT_URL,
  },
};

const Foursquare = nodeFoursquare(config);

// Using express was just faster... *sigh*
const app = express();

app.get('/', (req, res) => {
  const url = Foursquare.getAuthClientRedirectUrl(
    config.secrets.clientId,
    config.secrets.redirectUrl
  );
  res.writeHead(303, { location: url });
  res.end();
});

app.get('/callback', (req, res) => {
  Foursquare.getAccessToken(
    {
      code: req.query.code,
    },
    (error, accessToken) => {
      if (error) {
        res.send(`An error was thrown: ${error.message}`);
      } else {
        res.redirect(`/test?token=${accessToken}`);
      }
    }
  );
});

app.get('/test', (req, res) => {
  const accessToken = req.query.token || null;
  process.env.ACCESS_TOKEN = accessToken;
  let type = `Running Jest tests with${accessToken ? '' : 'out'} Authorization`;

  if (!accessToken) {
    type += ' (tests of API endpoints requiring an access token will not pass)';
  }

  res.send(
    `<html><title>Refer to Console</title><body>${type}...</body></html>`
  );

  const { runCLI } = jest;
  runCLI({}, [__dirname]).then(() => {
    process.exit();
  });
});

app.listen(3000);
