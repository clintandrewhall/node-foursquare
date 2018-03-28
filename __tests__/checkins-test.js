let Foursquare = null;
let accessToken = process.env.ACCESS_TOKEN;

beforeAll(() => {
  Foursquare = require('./../dist/node-foursquare')({
    foursquare: {
      mode: 'foursquare',
      version: process.env.VERSION,
    },
    secrets: {
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      redirectUrl: process.env.REDIRECT_URL,
    },
  });
});

test('Foursquare.Checkins.getCheckinDetails(502bcde16de4146b7f104ac6)', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data.checkin).toBeTruthy();
    expect(data.checkin.id).toBe('502bcde16de4146b7f104ac6');
    expect(data.checkin.type).toBe('checkin');
    done();
  };

  Foursquare.Checkins.getCheckinDetails(
    '502bcde16de4146b7f104ac6',
    null,
    accessToken,
    callback
  );
});

test('Foursquare.Checkins.getRecentCheckins()', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data.recent).toBeTruthy();
    done();
  };

  Foursquare.Checkins.getRecentCheckins(null, accessToken, callback);
});
