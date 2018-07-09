import dotenv from 'dotenv';
dotenv.config();

const { env } = process;
const {
  ACCESS_TOKEN,
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL,
  TEST_CHECKIN,
  TEST_SHORTCODE,
  VERSION,
} = env;

let Foursquare = null;

beforeAll(() => {
  Foursquare = require('./../dist/node-foursquare')({
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
});

test.skip('Foursquare.Checkins.add', () => {
  // There's no way to test this without creating a new checkin every time, and
  // there's no way to delete one once created.  CI would overload a person's
  // profile.
});

test.skip('Foursquare.Checkins.addPost', () => {
  // There's no way to test this without creating a new post every time, and
  // there's no way to delete a post once created.  CI would overload a
  // checkin with comments.
});

test('Foursquare.Checkins.getDetails(' + TEST_CHECKIN + ')', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data.checkin).toBeTruthy();
    expect(data.checkin.id).toBe(TEST_CHECKIN);
    expect(data.checkin.type).toBe('checkin');
    done();
  };

  Foursquare.Checkins.getDetails(TEST_CHECKIN, null, ACCESS_TOKEN, callback);
});

test('Foursquare.Checkins.like(' + TEST_CHECKIN + ')', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data.likes).toBeDefined();
    expect(data.likes.count).toBeDefined();
    expect(data.likes.groups).toBeDefined();
    done();
  };

  Foursquare.Checkins.like(TEST_CHECKIN, null, ACCESS_TOKEN, callback);
});

test.skip('Foursquare.Checkins.resolve(' + TEST_SHORTCODE + ')', done => {
  // I haven't been able to find a shortcode.
});

test('Foursquare.Checkins.unlike(' + TEST_CHECKIN + ')', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data.likes).toBeDefined();
    expect(data.likes.count).toBeDefined();
    expect(data.likes.groups).toBeDefined();
    done();
  };

  Foursquare.Checkins.unlike(TEST_CHECKIN, null, ACCESS_TOKEN, callback);
});
