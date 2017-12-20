'use strict';

var path = require('path'),
    util = require('util');

module.exports = function (config) {
  var core = require('./core')(config),
      logger = core.getLogger('venues');

  function getCategories(params, accessToken, callback) {
    logger.enter('getCategories');
    logger.debug('getCategories:params: ' + util.inspect(params));
    core.callApi('/venues/categories', accessToken, params || {}, callback);
  }

  function explore(lat, lng, near, params, accessToken, callback) {
    logger.enter('explore');
    params = params || {};

    if (!lat || !lng) {
      if (!near) {
        logger.error('Lat and Lng or near are required parameters.');
        callback(new Error('Venues.explore: lat and lng or near are both required.'));
        return;
      } else {
        params.near = near;
      }
    } else {
      params.ll = lat + ',' + lng;
    }
    logger.debug('explore:params: ' + util.inspect(params));

    core.callApi('/venues/explore', accessToken, params, callback);
  }

  function search(lat, lng, near, params, accessToken, callback) {
    logger.enter('search');
    params = params || {};

    if (params.intent !== 'global') {
      if (!lat || !lng) {
        if (!near) {
          if (!params.ne || !params.sw) {
            logger.error('Either lat and lng, near, or ne/sw are required as parameters.');
            callback(new Error('Venues.explore: near or ne/sw must be specified if lat and lng are not set.'));
            return;
          }
        } else {
          params.near = near;
        }
      } else {
        params.ll = lat + ',' + lng;
      }
    }

    logger.debug('search:lat: ' + lat);
    logger.debug('search:lng: ' + lng);
    logger.debug('search:near: ' + near);
    logger.debug('search:params: ' + util.inspect(params));
    core.callApi('/venues/search', accessToken, params, callback);
  }

  function getTrending(lat, lng, params, accessToken, callback) {
    logger.enter('trending');
    params = params || {};

    if (!lat || !lng) {
      logger.error('Lat and Lng are both required parameters.');
      callback(new Error('Venues.explore: lat and lng are both required.'));
      return;
    }

    logger.debug('search:lat: ' + lat);
    logger.debug('search:lng: ' + lng);
    logger.debug('getTrending:params: ' + util.inspect(params));
    params.ll = lat + ',' + lng;
    core.callApi('/venues/trending', accessToken, params, callback);
  }

  function getVenue(venueId, accessToken, callback) {
    logger.enter('getVenue');

    if (!venueId) {
      logger.error('getVenue: venueId is required.');
      callback(new Error('Venues.getVenue: venueId is required.'));
      return;
    }

    logger.debug('getVenue:venueId: ' + venueId);
    core.callApi(path.join('/venues', venueId), accessToken, null, callback);
  }

  function getVenueAspect(venueId, aspect, params, accessToken, callback) {
    logger.enter('getVenueAspect');

    if (!venueId) {
      logger.error('getVenueAspect: venueId is required.');
      callback(new Error('Venues.getVenueAspect: venueId is required.'));
      return;
    }

    if (!aspect) {
      logger.error('getVenueAspect: aspect is required.');
      callback(new Error('Venues.getVenueAspect: aspect is required.'));
      return;
    }

    logger.debug('getVenueAspect:venueId: ' + venueId);
    logger.debug('getVenueAspect:aspect: ' + aspect);
    logger.debug('getVenueAspect:params: ' + util.inspect(params));
    core.callApi(path.join('/venues', venueId, aspect), accessToken, params || {}, callback);
  }

  function getHereNow(venueId, params, accessToken, callback) {
    logger.enter('getHereNow');

    if (!venueId) {
      logger.error('getHereNow: venueId is required.');
      callback(new Error('Venues.getHereNow: venueId is required.'));
      return;
    }

    logger.debug('getHereNow:venueId: ' + venueId);
    logger.debug('getHereNow:params: ' + util.inspect(params));
    core.callApi(path.join('/venues', venueId, 'herenow'), accessToken, params || {}, callback);
  }

  function getTips(venueId, params, accessToken, callback) {
    logger.enter('getTips');

    if (!venueId) {
      logger.error('getTips: venueId is required.');
      callback(new Error('Venues.getTips: venueId is required.'));
      return;
    }

    logger.debug('getTips:venueId: ' + venueId);
    logger.debug('getTips:params: ' + util.inspect(params));
    getVenueAspect(venueId, 'tips', params, accessToken, callback);
  }

  function getListed(venueId, params, accessToken, callback) {
    logger.enter('getLists');

    if (!venueId) {
      logger.error('getLists: venueId is required.');
      callback(new Error('Venues.getLists: venueId is required.'));
      return;
    }

    logger.debug('getLists:venueId: ' + venueId);
    logger.debug('getLists:params: ' + util.inspect(params));
    getVenueAspect(venueId, 'listed', params, accessToken, callback);
  }

  function getStats(venueId, params, accessToken, callback) {
    logger.enter('getStats');

    if (!venueId) {
      logger.error('getStats: venueId is required.');
      callback(new Error('Venues.getStats: venueId is required.'));
      return;
    }

    logger.debug('getStats:venueId: ' + venueId);
    logger.debug('getStats:params: ' + util.inspect(params));
    getVenueAspect(venueId, 'stats', params, accessToken, callback);
  }

  function getPhotos(venueId, group, params, accessToken, callback) {
    logger.enter('getPhotos');

    if (!venueId) {
      logger.error('getPhotos: venueId is required.');
      callback(new Error('Venues.getPhotos: venueId is required.'));
      return;
    }

    logger.debug('getPhotos:venueId: ' + venueId);
    logger.debug('getPhotos:group: ' + group);
    logger.debug('getPhotos:params: ' + util.inspect(params));
    params = params || {};
    params.group = group || 'venue';
    getVenueAspect(venueId, 'photos', params, accessToken, callback);
  }

  function getLinks(venueId, accessToken, callback) {
    logger.enter('getLinks');

    if (!venueId) {
      logger.error('getLinks: venueId is required.');
      callback(new Error('Venues.getLinks: venueId is required.'));
      return;
    }

    logger.debug('getLinks:venueId: ' + venueId);
    getVenueAspect(venueId, 'links', {}, accessToken, callback);
  }

  function getEvents(venueId, accessToken, callback) {
    logger.enter('getEvents');

    if (!venueId) {
      logger.error('getEvents: venueId is required.');
      callback(new Error('Venues.getEvents: venueId is required.'));
      return;
    }

    logger.debug('getEvents:venueId: ' + venueId);
    getVenueAspect(venueId, 'events', {}, accessToken, callback);
  }

  function getLikes(venueId, accessToken, callback) {
    logger.enter('getLikes');

    if (!venueId) {
      logger.error('getLikes: venueId is required.');
      callback(new Error('Venues.getLikes: venueId is required.'));
      return;
    }

    logger.debug('getLikes:venueId: ' + venueId);
    getVenueAspect(venueId, 'likes', {}, accessToken, callback);
  }

  function getHours(venueId, accessToken, callback) {
    logger.enter('getHours');

    if (!venueId) {
      logger.error('getHours: venueId is required.');
      callback(new Error('Venues.getHours: venueId is required.'));
      return;
    }

    logger.debug('getHours:venueId: ' + venueId);
    getVenueAspect(venueId, 'hours', {}, accessToken, callback);
  }

  function getSimilar(venueId, accessToken, callback) {
    logger.enter('getSimilar');

    if (!venueId) {
      logger.error('getSimilar: venueId is required.');
      callback(new Error('Venues.getSimilar: venueId is required.'));
      return;
    }

    logger.debug('getSimilar:venueId: ' + venueId);
    getVenueAspect(venueId, 'similar', {}, accessToken, callback);
  }

  function getMenu(venueId, accessToken, callback) {
    logger.enter('getMenu');

    if (!venueId) {
      logger.error('getMenu: venueId is required.');
      callback(new Error('Venues.getMenu: venueId is required.'));
      return;
    }

    logger.debug('getMenu:venueId: ' + venueId);
    getVenueAspect(venueId, 'menu', {}, accessToken, callback);
  }

  function getTimeseries(venueIds, params, accessToken, callback) {
    logger.enter('getTimeseries');

    if (!venueIds) {
      logger.error('getTimeseries: venueIds is required.');
      callback(new Error('Venues.getTimeseries: venueIds is required.'));
      return;
    }
    logger.debug('getTimeseries:venueIds: ' + venueIds);
    venueIds = [].concat(venueIds);
    venueIds = venueIds.join(',');
    getVenueAspect(venueIds, 'timeseries', params, accessToken, callback);
  }

  function getManaged(accessToken, callback) {
    logger.enter('getManaged');
    core.callApi('/venues/managed', accessToken, {}, callback);
  }

  function getSuggestcompletion(lat, lng, query, params, accessToken, callback) {
    logger.enter('suggestComplete');
    params = params || {};

    logger.debug('getSuggestcompletion:params: ' + util.inspect(params));

    if (!query || query.length < 3) {
      logger.error('Query is required and must be at least 3 characters long.');
      callback(new Error('Venues.getSuggestcompletion: Query is required and must be at least 3 characters long.'));
      return;
    }

    if (!lat || !lng) {
      if (!params.near) {
        logger.error('Either lat and lng or near are required as parameters.');
        callback(new Error('Venues.getSuggestcompletion: near must be specified as a parameter if lat and lng are not set.'));
        return;
      }
    } else {
      params.ll = lat + ',' + lng;
    }

    if (!query) {
      logger.error('Query is a required parameter.');
      callback(new Error('Venues.getSuggestcompletion: query is a required parameter.'));
      return;
    }
    params.query = query;

    logger.debug('getSuggestcompletion:lat: ' + lat);
    logger.debug('getSuggestcompletion:lng: ' + lng);
    logger.debug('getSuggestcompletion:query: ' + query);
    core.callApi('/venues/suggestcompletion', accessToken, params, callback);
  }

  return {
    'explore': explore,
    'getCategories': getCategories,
    'getEvents': getEvents,
    'getHereNow': getHereNow,
    'getHours': getHours,
    'getLikes': getLikes,
    'getLinks': getLinks,
    'getListed': getListed,
    'getManaged': getManaged,
    'getMenu': getMenu,
    'getPhotos': getPhotos,
    'getSimilar': getSimilar,
    'getStats': getStats,
    'getSuggestcompletion': getSuggestcompletion,
    'getTimeseries': getTimeseries,
    'getTips': getTips,
    'getTrending': getTrending,
    'getVenue': getVenue,
    'getVenueAspect': getVenueAspect,
    'search': search
  };
};