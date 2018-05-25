'use strict';

var _extends = Object.assign || function (target) { for (var i = 1, source; i < arguments.length; i++) { source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var coreModule = require('./core'),
    locations = require('./util/locations'),
    emptyCallback = function emptyCallback() {},
    path = require('path');

module.exports = function (config) {
  var core = coreModule(config),
      logger = core.getLogger('checkins'),
      module = 'Checkins';


  function addPostToCheckin(checkinId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        accessToken = arguments[2],
        callback = arguments[3],
        method = 'addPostToCheckin';

    logger.enter(method);

    if (!checkinId) {
      logger.error(`${method}: checkinId is required.`);
      callback(new Error(`${module}.${method}: checkinId is required.`));
      return;
    }

    core.postApi(path.join('/checkins', checkinId, 'addpost'), accessToken, params, callback);
  }

  function createCheckin(venueId, params, accessToken, callback) {
    var method = 'createCheckin';
    logger.enter(method);

    if (!venueId) {
      logger.error(`${method}: venueId is required.`);
      callback(new Error(`${module}.${method}: venueId is required.`));
      return;
    }

    var providedParams = params || {},
        location = providedParams.location,
        otherParams = _objectWithoutProperties(providedParams, ['location']),
        locationParams = locations.getLocationAPIParameter(params, method, module, logger, callback);

    core.postApi('/checkins/add', accessToken, _extends({
      venueId
    }, locationParams, otherParams), callback);
  }

  function getCheckinDetails(checkinId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        accessToken = arguments[2],
        callback = arguments[3],
        method = 'getCheckinDetails';

    logger.enter(method);

    if (!checkinId) {
      logger.error(`${method}: checkinId is required.`);
      callback(new Error(`${module}.${method}: checkinId is required.`));
      return;
    }

    core.callApi(path.join('/checkins', checkinId), accessToken, params, callback);
  }

  function getRecentCheckins() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : emptyCallback,
        accessToken = arguments[1],
        method = 'getRecentCheckins';

    logger.enter(method);
    var providedParams = params || {},
        location = providedParams.location,
        otherParams = _objectWithoutProperties(providedParams, ['location']),
        locationParams = locations.getLocationAPIParameter(params, method, module, logger, callback);

    core.callApi('/checkins/recent', accessToken, _extends({}, locationParams, otherParams), callback);
  }

  function likeCheckin(checkinId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        accessToken = arguments[2],
        callback = arguments[3],
        method = 'likeCheckin';

    logger.enter(method);

    if (!checkinId) {
      logger.error(`${method}: checkinId is required.`);
      callback(new Error(`${module}.${method}: checkinId is required.`));
      return;
    }

    core.postApi(path.join('/checkins', checkinId, 'like'), accessToken, { set: 1 }, callback);
  }

  function resolveCheckin(shortId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        accessToken = arguments[2],
        callback = arguments[3],
        method = 'resolveCheckin';

    logger.enter(method);

    if (!shortId) {
      logger.error(`${method}: shortId is required.`);
      callback(new Error(`${module}.${method}: shortId is required.`));
      return;
    }

    core.postApi('/checkins/resolve', accessToken, { shortId }, callback);
  }

  function unlikeCheckin(checkinId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        accessToken = arguments[2],
        callback = arguments[3],
        method = 'unlikeCheckin';

    logger.enter(method);

    if (!checkinId) {
      logger.error(`${method}: checkinId is required.`);
      callback(new Error(`${module}.${method}: checkinId is required.`));
      return;
    }

    core.postApi(path.join('/checkins', checkinId, 'like'), accessToken, { set: 0 }, callback);
  }

  return {
    addPostToCheckin,
    createCheckin,
    getCheckinDetails,
    getRecentCheckins,
    likeCheckin,
    resolveCheckin,
    unlikeCheckin
  };
};