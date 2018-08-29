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
  TEST_VENUES_PLACE,
  TEST_VENUES_VENUE_ID,
  TEST_VENUES_VENUE_SHORT_QUERY,
  TEST_VENUES_VENUE_LONG_QUERY,
  VERSION,
} = env;

const NE = { lat: '39.063281', long: '-94.566989' };
const SW = { lat: '39.028485', long: '-94.607845' };
const LOCATION = { lat: '39.052310', long: '-94.589761' };

const {Venues} = Foursquare({
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

test('Venues.browseBox', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.venues).toBeArray();
    done();
  };

  Venues.browseBox(NE, SW, null, ACCESS_TOKEN, callback);
});

test('Venues.browseCircle', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.venues).toBeArray();
    done();
  };

  Venues.browseCircle(LOCATION, 1000, null, ACCESS_TOKEN, callback);
});

test('Venues.exploreLocation', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.suggestedBounds).toBeDefined();
    expect(data.groups).toBeArray();
    done();
  };

  Venues.exploreLocation(LOCATION, 1000, null, ACCESS_TOKEN, callback);
});

test('Venues.exploreNear', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.geocode).toBeDefined();
    expect(data.suggestedBounds).toBeDefined();
    expect(data.groups).toBeArray();
    done();
  };

  Venues.exploreNear(TEST_VENUES_PLACE, null, ACCESS_TOKEN, callback);
});

test('Venues.getBoxedSuggestCompletion', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.minivenues).toBeArray();
    done();
  };

  Venues.getBoxedSuggestCompletion(
    NE,
    SW,
    TEST_VENUES_VENUE_SHORT_QUERY,
    null,
    ACCESS_TOKEN,
    callback
  );
});

test('Venues.getCategories', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.categories).toBeArray();
    done();
  };

  Venues.getCategories(null, ACCESS_TOKEN, callback);
});

test('Venues.getDetails', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.venue).toBeDefined();
    expect(data.venue.id).toEqual(TEST_VENUES_VENUE_ID);
    done();
  };

  Venues.getDetails(TEST_VENUES_VENUE_ID, null, ACCESS_TOKEN, callback);
});

test('Venues.getEvents', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.events).toBeDefined();
    expect(data.events.count).toBeNumber();
    expect(data.events.items).toBeArray();
    done();
  };

  Venues.getEvents(TEST_VENUES_VENUE_ID, null, ACCESS_TOKEN, callback);
});

test('Venues.getHours', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.hours).toBeDefined();
    done();
  };

  Venues.getHours(TEST_VENUES_VENUE_ID, null, ACCESS_TOKEN, callback);
});

test('Venues.getLikes', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.like).toBeBoolean();
    expect(data.likes).toBeDefined();
    expect(data.likes.count).toBeNumber();
    done();
  };

  Venues.getLikes(TEST_VENUES_VENUE_ID, null, ACCESS_TOKEN, callback);
});

test('Venues.getLinks', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.links).toBeDefined();
    expect(data.links.count).toBeNumber();
    expect(data.links.items).toBeArray();
    done();
  };

  Venues.getLinks(TEST_VENUES_VENUE_ID, null, ACCESS_TOKEN, callback);
});

test('Venues.getListed', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.lists).toBeDefined();
    expect(data.lists.count).toBeNumber();
    expect(data.lists.groups).toBeArray();
    done();
  };

  Venues.getListed(TEST_VENUES_VENUE_ID, null, ACCESS_TOKEN, callback);
});

test('Venues.getLocationSuggestCompletion', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.minivenues).toBeArray();
    done();
  };

  Venues.getLocationSuggestCompletion(
    LOCATION,
    TEST_VENUES_VENUE_SHORT_QUERY,
    null,
    ACCESS_TOKEN,
    callback
  );
});

test('Venues.getLocationTrending', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.venues).toBeDefined();
    done();
  };

  Venues.getLocationTrending(LOCATION, null, ACCESS_TOKEN, callback);
});

test('Venues.getManagedVenues', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.venues).toBeDefined();
    expect(data.venues.count).toBeNumber();
    expect(data.venues.items).toBeArray();
    done();
  };

  Venues.getManagedVenues(null, ACCESS_TOKEN, callback);
});

test('Venues.getMenu', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.menu).toBeDefined();
    done();
  };

  Venues.getMenu(TEST_VENUES_VENUE_ID, null, ACCESS_TOKEN, callback);
});

test('Venues.getNearSuggestCompletion', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.venues).toBeArray();
    expect(data.geocode).toBeDefined();
    done();
  };

  Venues.getNearSuggestCompletion(
    TEST_VENUES_PLACE,
    TEST_VENUES_VENUE_SHORT_QUERY,
    null,
    ACCESS_TOKEN,
    callback
  );
});

test('Venues.getNearTrending', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.venues).toBeArray();
    expect(data.geocode).toBeDefined();
    done();
  };

  Venues.getNearTrending(TEST_VENUES_PLACE, null, ACCESS_TOKEN, callback);
});

test('Venues.getNextVenues', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.nextVenues).toBeDefined();
    expect(data.nextVenues.count).toBeNumber();
    expect(data.nextVenues.items).toBeArray();
    done();
  };

  Venues.getNextVenues(TEST_VENUES_VENUE_ID, null, ACCESS_TOKEN, callback);
});

test('Venues.getPhotos', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.photos).toBeDefined();
    expect(data.photos.count).toBeNumber();
    expect(data.photos.items).toBeArray();
    done();
  };

  Venues.getPhotos(TEST_VENUES_VENUE_ID, null, ACCESS_TOKEN, callback);
});

test('Venues.getSimilar', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.similarVenues).toBeDefined();
    expect(data.similarVenues.count).toBeNumber();
    expect(data.similarVenues.items).toBeArray();
    done();
  };

  Venues.getSimilar(TEST_VENUES_VENUE_ID, null, ACCESS_TOKEN, callback);
});

// I don't currently manage a venue.
test.skip('Venues.getStats', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    done();
  };

  Venues.getStats(TEST_VENUES_VENUE_ID, null, ACCESS_TOKEN, callback);
});

// I don't currently manage a venue.
test.skip('Venues.getTimeSeriesStats', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    done();
  };

  Venues.getTimeSeriesStats(
    [TEST_VENUES_VENUE_ID],
    1531430009,
    null,
    ACCESS_TOKEN,
    callback
  );
});

test('Venues.getTips', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.tips).toBeDefined();
    expect(data.tips.count).toBeNumber();
    expect(data.tips.items).toBeArray();
    done();
  };

  Venues.getTips(TEST_VENUES_VENUE_ID, null, ACCESS_TOKEN, callback);
});

test('Venues.globalSearch', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.venues).toBeArray();
    done();
  };

  Venues.globalSearch(
    TEST_VENUES_VENUE_LONG_QUERY,
    null,
    ACCESS_TOKEN,
    callback
  );
});

test('Venues.like', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.likes).toBeDefined();
    done();
  };

  Venues.like(TEST_VENUES_VENUE_ID, null, ACCESS_TOKEN, callback);
});

test('Venues.match', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.venues).toBeArray();
    done();
  };

  Venues.match(
    LOCATION,
    TEST_VENUES_VENUE_SHORT_QUERY,
    null,
    ACCESS_TOKEN,
    callback
  );
});

test('Venues.searchLocation', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.venues).toBeArray();
    done();
  };

  Venues.searchLocation(LOCATION, null, ACCESS_TOKEN, callback);
});

test('Venues.searchNear', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.venues).toBeArray();
    done();
  };

  Venues.searchNear(TEST_VENUES_PLACE, null, ACCESS_TOKEN, callback);
});

test('Venues.unlike', done => {
  const callback = (error, data) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.likes).toBeDefined();
    done();
  };

  Venues.unlike(TEST_VENUES_VENUE_ID, null, ACCESS_TOKEN, callback);
});
