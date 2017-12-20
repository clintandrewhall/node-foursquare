'use strict';

var path = require('path'),
    util = require('util');

module.exports = function (config) {
  var core = require('./core')(config),
      logger = core.getLogger('events');

  function getList(listId, accessToken, callback) {
    logger.enter('getList');

    if (!listId) {
      logger.error('getList: listId is required.');
      callback(new Error('Lists.getList: listId is required.'));
      return;
    }

    logger.debug('getList:listId: ' + listId);
    core.callApi(path.join('/lists', listId), accessToken, null, callback);
  }

  function getFollowers(listId, accessToken, callback) {
    logger.enter('getFollowers');

    if (!listId) {
      logger.error('getFollowers: listId is required.');
      callback(new Error('Lists.getFollowers: listId is required.'));
      return;
    }

    logger.debug('getList:listId: ' + listId);
    core.callApi(path.join('/lists', listId, 'followers'), accessToken, null, callback);
  }

  function getSuggestedVenues(listId, accessToken, callback) {
    logger.enter('getSuggestedVenues');

    if (!listId) {
      logger.error('getSuggestedVenues: listId is required.');
      callback(new Error('Lists.getSuggestedVenues: listId is required.'));
      return;
    }

    logger.debug('getList:listId: ' + listId);
    core.callApi(path.join('/lists', listId, 'suggestvenues'), accessToken, null, callback);
  }

  function getSuggestedPhotos(listId, itemId, accessToken, callback) {
    logger.enter('getSuggestedPhotos');

    if (!listId) {
      logger.error('getSuggestedPhotos: listId is required.');
      callback(new Error('Lists.getSuggestedPhotos: listId is required.'));
      return;
    }

    if (!itemId) {
      logger.error('getSuggestedPhotos: itemId is required.');
      callback(new Error('Lists.getSuggestedPhotos: itemId is required.'));
      return;
    }

    logger.debug('getList:listId: ' + listId);
    logger.debug('getList:itemId: ' + itemId);
    core.callApi(path.join('/lists', listId, 'suggestphoto'), accessToken, { 'itemId': itemId }, callback);
  }

  function getSuggestedTips(listId, itemId, accessToken, callback) {
    logger.enter('getSuggestedTips');

    if (!listId) {
      logger.error('getSuggestedTips: listId is required.');
      callback(new Error('Lists.getSuggestedTips: listId is required.'));
      return;
    }

    if (!itemId) {
      logger.error('getSuggestedTips: itemId is required.');
      callback(new Error('Lists.getSuggestedTips: itemId is required.'));
      return;
    }

    logger.debug('getList:listId: ' + listId);
    logger.debug('getList:itemId: ' + itemId);
    core.callApi(path.join('/lists', listId, 'suggesttip'), accessToken, { 'itemId': itemId }, callback);
  }

  return {
    'getList': getList,
    'getFollowers': getFollowers,
    'getSuggestedPhotos': getSuggestedPhotos,
    'getSuggestedTips': getSuggestedTips,
    'getSuggestedVenues': getSuggestedVenues
  };
};