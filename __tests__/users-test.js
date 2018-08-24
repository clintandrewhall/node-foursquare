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
  TEST_USER_ID,
  TEST_USERS_USER_ID,
  VERSION,
} = env;

const { Users } = Foursquare({
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

test('Users.search', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.results).toBeArray();
    done();
  };

  Users.search({ name: 'John' }, ACCESS_TOKEN, callback);
});

test('Users.getDetails', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.user).toBeDefined();
    expect(data.user.id).toEqual(TEST_USERS_USER_ID);
    done();
  };

  Users.getDetails(TEST_USERS_USER_ID, ACCESS_TOKEN, callback);
});

test('Users.getSelfDetails', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.user).toBeDefined();
    expect(data.user.id).toEqual(TEST_USER_ID);
    done();
  };

  Users.getSelfDetails(ACCESS_TOKEN, callback);
});

test('Users.getSelfCheckins', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.checkins).toBeDefined();
    expect(data.checkins.count).toBeNumber();
    expect(data.checkins.items).toBeArray();
    done();
  };

  Users.getSelfCheckins(null, ACCESS_TOKEN, callback);
});

test('Users.getFriends', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.friends).toBeDefined();
    expect(data.friends.count).toBeNumber();
    expect(data.friends.items).toBeArray();
    done();
  };

  Users.getFriends(TEST_USERS_USER_ID, null, ACCESS_TOKEN, callback);
});

test('Users.getSelfFriends', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.friends).toBeDefined();
    expect(data.friends.count).toBeNumber();
    expect(data.friends.items).toBeArray();
    done();
  };

  Users.getSelfFriends(null, ACCESS_TOKEN, callback);
});

test('Users.getLists', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.lists).toBeDefined();
    expect(data.lists.count).toBeNumber();
    expect(data.lists.groups).toBeArray();
    done();
  };

  Users.getLists(TEST_USERS_USER_ID, null, ACCESS_TOKEN, callback);
});

test('Users.getSelfLists', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.lists).toBeDefined();
    expect(data.lists.count).toBeNumber();
    expect(data.lists.groups).toBeArray();
    done();
  };

  Users.getSelfLists(null, ACCESS_TOKEN, callback);
});

test('Users.getPhotos', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.photos).toBeDefined();
    expect(data.photos.count).toBeNumber();
    expect(data.photos.items).toBeArray();
    done();
  };

  Users.getPhotos(TEST_USERS_USER_ID, null, ACCESS_TOKEN, callback);
});

test('Users.getSelfPhotos', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.photos).toBeDefined();
    expect(data.photos.count).toBeNumber();
    expect(data.photos.items).toBeArray();
    done();
  };

  Users.getSelfPhotos(null, ACCESS_TOKEN, callback);
});

test('Users.getSelfVenueHistory', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.venues).toBeDefined();
    expect(data.venues.count).toBeNumber();
    expect(data.venues.items).toBeArray();
    done();
  };

  Users.getSelfVenueHistory(null, ACCESS_TOKEN, callback);
});

test('Users.getVenueLikes', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.venues).toBeDefined();
    expect(data.venues.count).toBeNumber();
    expect(data.venues.items).toBeArray();
    done();
  };

  Users.getVenueLikes(TEST_USERS_USER_ID, null, ACCESS_TOKEN, callback);
});

test('Users.getSelfVenueLikes', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.venues).toBeDefined();
    expect(data.venues.count).toBeNumber();
    expect(data.venues.items).toBeArray();
    done();
  };

  Users.getSelfVenueLikes(null, ACCESS_TOKEN, callback);
});

// Not working - 07/10/18
test.skip('Users.getTastes', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.tastes).toBeDefined();
    expect(data.tastes.count).toBeNumber();
    expect(data.tastes.items).toBeArray();
    done();
  };

  Users.getTastes(TEST_USERS_USER_ID, null, ACCESS_TOKEN, callback);
});

// Not working - 07/10/18
test.skip('Users.getSelfTastes', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.tastes).toBeDefined();
    expect(data.tastes.count).toBeNumber();
    expect(data.tastes.items).toBeArray();
    done();
  };

  Users.getSelfTastes(null, ACCESS_TOKEN, callback);
});
