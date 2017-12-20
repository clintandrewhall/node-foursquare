'use strict';

var path = require('path');

module.exports = function (config) {
  var core = require('./core')(config),
      logger = core.getLogger('settings');

  function getSettings(accessToken, callback) {
    logger.enter('getSettings');
    core.callApi('/settings/all', accessToken, null, callback);
  }

  function getSetting(name, accessToken, callback) {
    logger.enter('getSetting');

    if (!name) {
      logger.error('getSetting: name is required.');
      callback(new Error('Settings.getSetting: name is required.'));
      return;
    }

    logger.debug('getSetting:name: ' + name);
    core.callApi(path.join('/settings/', name), accessToken, null, callback);
  }

  return {
    'getSetting': getSetting,
    'getSettings': getSettings
  };
};