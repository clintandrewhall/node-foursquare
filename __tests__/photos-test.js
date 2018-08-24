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
  TEST_PHOTO_ID,
  VERSION,
} = env;

const { Photos } = Foursquare({
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

test('Photos.get(' + TEST_PHOTO_ID + ')', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data.photo).toBeTruthy();
    expect(data.photo.id).toBe(TEST_PHOTO_ID);
    done();
  };

  Photos.get(TEST_PHOTO_ID, null, ACCESS_TOKEN, callback);
});
