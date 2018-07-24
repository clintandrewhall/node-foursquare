/* @flow */
require('babel-polyfill');
import express from 'express';
import jest from 'jest';

import nodeFoursquare from './../';

require('dotenv').config();

const config = {
  foursquare: {
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

app.get('/', (req: express$Request, res: express$Response) => {
  const url = Foursquare.getAuthClientRedirectUrl();
  res.writeHead(303, { location: url });
  res.end();
});

app.get('/callback', (req: express$Request, res: express$Response) => {
  const code = ((req.query.code: any): string);
  Foursquare.getAccessToken(
    {
      code,
    },
    (error: ?Error, accessToken: ?string) => {
      if (error) {
        res.send(`An error was thrown: ${error.message}`);
      } else if (!accessToken) {
        res.send(`No access token was provided`);
      } else {
        res.redirect(`/test?token=${accessToken}`);
      }
    }
  );
});

app.get('/test', (req: express$Request, res: express$Response) => {
  const accessToken = ((req.query.token: any): string) || '';
  process.env.ACCESS_TOKEN = accessToken;
  let type = `Running Jest tests with${accessToken ? '' : 'out'} Authorization`;

  if (!accessToken) {
    type += ' (tests of API endpoints requiring an access token will not pass)';
  }

  res.send(
    `<html><title>Refer to Console</title><body>${type}...</body></html>`
  );

  const { runCLI } = jest;
  runCLI({}, [__dirname], 'users-test').then(() => {
    process.exit();
  });
});

const server = app.listen(3000, () => {
  const spawn = require('child_process').spawn;
  const casper = spawn('npm', ['run', 'test-casper']);
  casper.stdout.pipe(process.stdout);

  casper.on('error', function() {
    server && server.close();
  });

  casper.on('close', function() {
    server && server.close();
  });
});
