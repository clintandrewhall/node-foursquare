'use strict';

var util = require('util'),
    path = require('path');

module.exports = function (config) {
  var core = require('./core')(config),
      logger = core.getLogger('specials');

  function search(lat, lng, params, accessToken, callback) {
    logger.enter('search');
    params = params || {};

    if (!lat || !lng) {
      logger.error('Lat and Lng are both required parameters.');
      callback(new Error('Specials.search: lat and lng are both required.'));
      return;
    }
    logger.debug('search:lat: ' + lat);
    logger.debug('search:lng: ' + lng);
    logger.debug('search:params: ' + util.inspect(params));
    params.ll = lat + ',' + lng;

    core.callApi('/specials/search', accessToken, params, callback);
  }

  function getSpecial(specialId, venueId, params, accessToken, callback) {
    logger.enter('getSpecial');
    params = params || {};

    if (!specialId) {
      logger.error('getSpecial: specialId is required.');
      callback(new Error('Specials.getSpecial: specialId is required.'));
      return;
    }

    if (!venueId) {
      logger.error('getSpecial: venueId is required.');
      callback(new Error('Specials.getSpecial: venueId is required.'));
      return;
    }

    logger.debug('getSpecial:specialId: ' + specialId);
    logger.debug('getSpecial:venueId: ' + venueId);
    logger.debug('getSpecial:params: ' + util.inspect(params));
    params['venueId'] = venueId;

    core.callApi(path.join('/specials', specialId), accessToken, params, callback);
  }

  function getList(venueId, params, accessToken, callback) {
    logger.enter('getList');
    params = params || {};

    if (!venueId) {
      logger.error('getList: venueId is required.');
      callback(new Error('Specials.getList: venueId is required.'));
      return;
    }
    logger.debug('getList:venueId: ' + venueId);
    logger.debug('getList:params: ' + util.inspect(params));

    core.callApi('/specials/list', accessToken, params, callback);
  }

  return {
    'getSpecial': getSpecial,
    'search': search
  };
};