/* @flow */

import dotenv from 'dotenv';
dotenv.config();

const { env } = process;
const {
  ACCESS_TOKEN,
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL,
  TEST_LIST_ID,
  TEST_LIST_NAME,
  TEST_LIST_USER_ID,
  TEST_LIST_USER_NAME,
  VERSION,
} = env;

let Foursquare = {};

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

test('Foursquare.Lists.getByID(' + (TEST_LIST_ID || '') + ')', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data.list).toBeDefined();
    expect(data.list.id).toBe(TEST_LIST_ID);
    done();
  };

  Foursquare.Lists.getByID(TEST_LIST_ID, ACCESS_TOKEN, callback);
});

test(
  'Foursquare.Lists.getByName(' +
    (TEST_LIST_USER_NAME || '') +
    ', ' +
    (TEST_LIST_NAME || '') +
    ')',
  done => {
    const callback = (error, data) => {
      expect(error).toBeNull();
      expect(data.list).toBeDefined();
      expect(data.list.id).toBe(TEST_LIST_ID);
      expect(data.list.user).toBeDefined();
      expect(data.list.user.id).toBe(TEST_LIST_USER_ID);
      done();
    };

    Foursquare.Lists.getByName(
      TEST_LIST_USER_NAME,
      TEST_LIST_NAME,
      ACCESS_TOKEN,
      callback
    );
  }
);

test(
  'Foursquare.Lists.getByName(' +
    (TEST_LIST_USER_ID || '') +
    ', ' +
    (TEST_LIST_NAME || '') +
    ')',
  done => {
    const callback = (error, data) => {
      expect(error).toBeNull();
      expect(data.list).toBeDefined();
      expect(data.list.id).toBe(TEST_LIST_ID);
      expect(data.list.user).toBeDefined();
      expect(data.list.user.id).toBe(TEST_LIST_USER_ID);
      done();
    };

    Foursquare.Lists.getByName(
      TEST_LIST_USER_ID,
      TEST_LIST_NAME,
      ACCESS_TOKEN,
      callback
    );
  }
);

test.skip('Foursquare.Lists.addItem', () => {
  // There's no way to test this without creating a new item every time, and
  // there's no way to delete an item once created.  CI would overload a
  // list with items.
});

test.skip('Foursquare.Lists.create', () => {
  // There's no way to test this without creating a new list every time, and
  // there's no way to delete a list once created.  CI would overload a
  // profile with lists.
});

test.skip('Foursquare.Lists.addItemByVenue', () => {
  // There's no way to test this without creating a new item every time, and
  // there's no way to delete an item once created.  CI would overload a
  // list with items.
});

test.skip('Foursquare.Lists.addItemByTip', () => {
  // There's no way to test this without creating a new item every time, and
  // there's no way to delete an item once created.  CI would overload a
  // list with items.
});

test.skip('Foursquare.Lists.shareList', () => {
  // There's no way to test this without sharing a list every time.
});
