import dotenv from 'dotenv';
dotenv.config();

const { env } = process;
const {
  ACCESS_TOKEN,
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL,
  TEST_PHOTO_ID,
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

test('Foursquare.Photos.get(' + TEST_PHOTO_ID + ')', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data.photo).toBeTruthy();
    expect(data.photo.id).toBe(TEST_PHOTO_ID);
    done();
  };

  Foursquare.Photos.get(TEST_PHOTO_ID, null, ACCESS_TOKEN, callback);
});
