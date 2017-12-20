'use strict';

var path = require('path'),
    util = require('util');

module.exports = function (config) {
  var core = require('./core')(config),
      logger = core.getLogger('events');

  function getEvent(eventId, accessToken, callback) {
    logger.enter('getEvent');

    if (!eventId) {
      logger.error('getEvent: eventId is required.');
      callback(new Error('Events.getEvent: eventId is required.'));
      return;
    }

    logger.debug('getEvent:eventId: ' + eventId);
    core.callApi(path.join('/events', eventId), accessToken, null, callback);
  }

  function search(params, accessToken, callback) {
    logger.enter('getTip');
    logger.debug('search:params: ' + util.inspect(params));
    core.callApi('/events/search', accessToken, params || {}, callback);
  }

  function getCategories(params, accessToken, callback) {
    logger.enter('getCategories');
    logger.debug('getCategories:params: ' + util.inspect(params));
    core.callApi('/events/categories', accessToken, params || {}, callback);
  }

  return {
    'getCategories': getCategories,
    'getEvent': getEvent,
    'search': search
  };
};