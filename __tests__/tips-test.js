/* @flow */
import dotenv from 'dotenv';
dotenv.config();

import Foursquare from './../src';

const env = ((process.env: any): { [string]: string });
const {
  ACCESS_TOKEN,
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL,
  TEST_TIP_ID,
  VERSION,
} = env;

const { Tips } = Foursquare({
  foursquare: {
    mode: 'foursquare',
    version: VERSION,
  },
  secrets: {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUrl: REDIRECT_URL,
  },
});

test('Tips.getDetails(' + TEST_TIP_ID + ')', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data.tip).toBeTruthy();
    expect(data.tip.id).toBe(TEST_TIP_ID);
    done();
  };

  Tips.getDetails(TEST_TIP_ID, ACCESS_TOKEN, callback);
});

test.skip('Tips.add', () => {
  // There's no way to test this without creating a new tip every time, and
  // there's no way to delete a tip once created.  CI would overload a
  // venue with tips.
});
