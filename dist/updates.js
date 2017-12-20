'use strict';

var path = require('path'),
    util = require('util');

module.exports = function (config) {
  var core = require('./core')(config),
      logger = core.getLogger('updates');

  function getUpdate(updateId, accessToken, callback) {
    logger.enter('getUpdate');

    if (!updateId) {
      logger.error('getUpdate: updateId is required.');
      callback(new Error('Updates.getUpdate: updateId is required.'));
      return;
    }

    logger.debug('getUpdate:updateId: ' + updateId);
    core.callApi(path.join('/updates', updateId), accessToken, null, callback);
  }

  function getNotifications(params, accessToken, callback) {
    logger.enter('getNotifications');
    logger.debug('getNotifications:params: ' + util.inspect(params));
    core.callApi('/updates/notifications', accessToken, params || {}, callback);
  }

  return {
    'getUpdate': getUpdate,
    'getNotifications': getNotifications
  };
};