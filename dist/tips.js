'use strict';

var path = require('path'),
    util = require('util');

module.exports = function (config) {
  var core = require('./core')(config),
      logger = core.getLogger('tips');

  function getTip(tipId, accessToken, callback) {
    logger.enter('getTip');

    if (!tipId) {
      logger.error('getTip: tipId is required.');
      callback(new Error('Tips.getTip: tipId is required.'));
      return;
    }

    logger.debug('getTip:tipId: ' + tipId);
    core.callApi(path.join('/tips', tipId), accessToken, null, callback);
  }

  function getLikes(tipId, accessToken, callback) {
    logger.enter('getLikes');

    if (!tipId) {
      logger.error('getLikes: tipId is required.');
      callback(new Error('Tips.getLikes: tipId is required.'));
      return;
    }

    logger.debug('getLikes:tipId: ' + tipId);
    core.callApi(path.join('/tips', tipId, 'likes'), accessToken, null, callback);
  }

  function getDone(tipId, params, accessToken, callback) {
    logger.enter('getDone');
    params = params || {};

    if (!tipId) {
      logger.error('getDone: tipId is required.');
      callback(new Error('Tips.getDone: tipId is required.'));
      return;
    }

    logger.debug('getDone:tipId: ' + tipId);
    core.callApi(path.join('/tips', tipId, 'done'), accessToken, params, callback);
  }

  function getListed(tipId, params, accessToken, callback) {
    logger.enter('getLists');
    params = params || {};

    if (!tipId) {
      logger.error('getLists: tipId is required.');
      callback(new Error('Tips.getLists: tipId is required.'));
      return;
    }

    logger.debug('getLists:tipId: ' + tipId);
    core.callApi(path.join('/tips', tipId, 'listed'), accessToken, params, callback);
  }

  return {
    'getDone': getDone,
    'getLikes': getLikes,
    'getListed': getListed,
    'getTip': getTip
  };
};