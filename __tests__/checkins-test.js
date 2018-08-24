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
  TEST_CHECKIN,
  TEST_SHORTCODE,
  VERSION,
} = env;

const { Checkins } = Foursquare({
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

test.skip('Checkins.add', () => {
  // There's no way to test this without creating a new checkin every time, and
  // there's no way to delete one once created.  CI would overload a person's
  // profile.
});

test.skip('Checkins.addPost', () => {
  // There's no way to test this without creating a new post every time, and
  // there's no way to delete a post once created.  CI would overload a
  // checkin with comments.
});

test('Checkins.getDetails(' + TEST_CHECKIN + ')', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data.checkin).toBeTruthy();
    expect(data.checkin.id).toBe(TEST_CHECKIN);
    expect(data.checkin.type).toBe('checkin');
    done();
  };

  Checkins.getDetails(TEST_CHECKIN, null, ACCESS_TOKEN, callback);
});

test('Checkins.like(' + TEST_CHECKIN + ')', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data.likes).toBeDefined();
    expect(data.likes.count).toBeDefined();
    expect(data.likes.groups).toBeDefined();
    done();
  };

  Checkins.like(TEST_CHECKIN, null, ACCESS_TOKEN, callback);
});

test.skip('Checkins.resolve(' + (TEST_SHORTCODE || '') + ')', done => {
  // I haven't been able to find a shortcode.
});

test('Checkins.unlike(' + (TEST_CHECKIN || '') + ')', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data.likes).toBeDefined();
    expect(data.likes.count).toBeDefined();
    expect(data.likes.groups).toBeDefined();
    done();
  };

  Checkins.unlike(TEST_CHECKIN, null, ACCESS_TOKEN, callback);
});
