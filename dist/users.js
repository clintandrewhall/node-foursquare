'use strict';

var util = require('util');

module.exports = function (config) {
  var core = require('./core')(config),
      logger = core.getLogger('users');

  function search(params, accessToken, callback) {
    logger.enter('search');
    logger.debug('search:params: ' + util.inspect(params));
    core.callApi('/users/search', accessToken, params || {}, callback);
  }

  function getRequests(accessToken, callback) {
    logger.enter('getRequests');
    core.callApi('/users/requests', accessToken, {}, callback);
  }

  function getUser(userId, accessToken, callback) {
    logger.enter('getUser');

    if (!userId) {
      logger.error('getUser: userId is required.');
      callback(new Error('Users.getUser: userId is required.'));
      return;
    }

    logger.debug('getUser:userId: ' + userId);
    core.callApi('/users/' + userId, accessToken, null, callback);
  }

  function getUserAspect(aspect, userId, params, accessToken, callback) {
    logger.enter('getUser');

    if (!aspect) {
      logger.error('getUserAspect: aspect is required.');
      callback(new Error('Users.getUserAspect: aspect is required.'));
      return;
    }
    logger.debug('getUserAspect:aspect,userId: ' + aspect + ',' + userId);
    logger.debug('getUserAspect:params: ' + util.inspect(params));

    core.callApi('/users/' + (userId || 'self') + '/' + aspect, accessToken, params, callback);
  }

  function getCheckins(userId, params, accessToken, callback) {
    logger.enter('getCheckins');
    logger.debug('getCheckins:params: ' + util.inspect(params));
    getUserAspect('checkins', userId, params, accessToken, callback);
  }

  function getFriends(userId, params, accessToken, callback) {
    logger.enter('getFriends');
    logger.debug('getFriends:params: ' + util.inspect(params));
    getUserAspect('friends', userId, params, accessToken, callback);
  }

  function getMayorships(userId, params, accessToken, callback) {
    logger.enter('getMayorships');
    logger.debug('getMayorships:userId: ' + userId);
    logger.debug('getMayorships:params: ' + util.inspect(params));
    getUserAspect('mayorships', userId, params, accessToken, callback);
  }

  function getLists(userId, params, accessToken, callback) {
    logger.enter('getLists');
    logger.debug('getLists:userId: ' + userId);
    logger.debug('getLists:params: ' + util.inspect(params));
    getUserAspect('lists', userId, params, accessToken, callback);
  }

  function getPhotos(userId, params, accessToken, callback) {
    logger.enter('getPhotos');
    logger.debug('getPhotos:userId: ' + userId);
    logger.debug('getPhotos:params: ' + util.inspect(params));
    getUserAspect('photos', userId, params, accessToken, callback);
  }

  function getTips(userId, params, accessToken, callback) {
    logger.enter('getTips');
    logger.debug('getTips:userId: ' + userId);
    logger.debug('getTips:params: ' + util.inspect(params));
    getUserAspect('tips', userId, params, accessToken, callback);
  }

  function getVenueHistory(userId, params, accessToken, callback) {
    logger.enter('getVenueHistory');
    logger.debug('getVenueHistory:userId: ' + userId);
    logger.debug('getVenueHistory:params: ' + util.inspect(params));
    getUserAspect('venuehistory', userId, params, accessToken, callback);
  }

  function getVenueLikes(userId, params, accessToken, callback) {
    logger.enter('getVenueLikes');
    logger.debug('getVenueLikes:userId: ' + userId);
    logger.debug('getVenueLikes:params: ' + util.inspect(params));
    getUserAspect('venuelikes', userId, params, accessToken, callback);
  }

  return {
    'getCheckins': getCheckins,
    'getFriends': getFriends,
    'getLists': getLists,
    'getMayorships': getMayorships,
    'getPhotos': getPhotos,
    'getRequests': getRequests,
    'getTips': getTips,
    'getUser': getUser,
    'getUserAspect': getUserAspect,
    'getVenueHistory': getVenueHistory,
    'getVenueLikes': getVenueLikes,
    'search': search
  };
};