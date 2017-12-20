'use strict';

var path = require('path'),
    util = require('util');

module.exports = function (config) {
  var core = require('./core')(config),
      logger = core.getLogger('photos');

  function getPhoto(photoId, accessToken, callback) {
    logger.enter('getPhoto');

    if (!photoId) {
      logger.error('getPhoto: photoId is required.');
      callback(new Error('Photos.getPhoto: photoId is required.'));
      return;
    }

    logger.debug('search:photoId: ' + photoId);
    core.callApi(path.join('/photos', photoId), accessToken, null, callback);
  }

  return {
    'getPhoto': getPhoto
  };
};