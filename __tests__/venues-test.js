/* @flow */
import dotenv from 'dotenv';
dotenv.config();

import { Foursquare } from './../src/node-foursquare';

const { env } = process;
const {
  ACCESS_TOKEN,
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL,
  TEST_USER_ID,
  TEST_VENUES_USER_ID,
  VERSION,
} = env;

const Venues = Foursquare.Venues({
  foursquare: {
    mode: 'foursquare',
    version: VERSION,
  },
  secrets: {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUrl: REDIRECT_URL,
  },
  winston: {
    all: {
      level: 'debug',
    },
  },
});

test('Foursquare.Venues.browseBox', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.venues).toBeArray();
    done();
  };

  Venues.browseBox(
    { lat: '39.063281', long: '-94.566989' },
    { lat: '39.028485', long: '-94.607845' },
    null,
    ACCESS_TOKEN,
    callback
  );
});
