'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
  var providedConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var config = (0, _mergeDeep2.default)(_configDefault2.default, providedConfig || {});
  var core = (0, _core2.default)(config);
  var logger = core.getLogger('users');
  var logHelper = new _logHelper2.default('Users', logger);

  var search = function search() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var accessToken = arguments[1];
    var callback = arguments[2];

    var method = 'search';
    logger.enter(method);
    logHelper.debugParams(params, method);
    core.callApi('/users/search', accessToken, params, callback);
  };

  var getDetails = function getDetails(userId, accessToken, callback) {
    var method = 'getDetails';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ userId }, method, callback)) {
      return;
    }

    core.callApi('/users/' + userId, accessToken, null, callback);
  };

  var getSelfDetails = function getSelfDetails(accessToken, callback) {
    return getDetails('self', accessToken, callback);
  };

  var getSelfCheckins = function getSelfCheckins() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var accessToken = arguments[1];
    var callback = arguments[2];

    var method = 'getSelfCheckins';
    logger.enter(method);
    logHelper.debugParams(params, method);
    core.callApi('/users/self/checkins', accessToken, params, callback);
  };

  var getFriends = function getFriends(userId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments[3];

    var method = 'getFriends';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ userId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.callApi(_path2.default.join('/users', userId, 'friends'), accessToken, params, callback);
  };

  var getSelfFriends = function getSelfFriends() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var accessToken = arguments[1];
    var callback = arguments[2];

    return getFriends('self', params, accessToken, callback);
  };

  var getLists = function getLists(userId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments[3];

    var method = 'getLists';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ userId }, method, callback)) {
      return;
    }

    params = params || {};

    var _params = params,
        location = _params.location,
        otherParams = _objectWithoutProperties(_params, ['location']);

    var locationParams = _locations2.default.getLocationAPIParameter(params, method, 'Lists', logger, callback);

    logHelper.debugParams(_extends({}, locationParams, otherParams), method);

    core.callApi(_path2.default.join('/users', userId, 'lists'), accessToken, _extends({}, locationParams, otherParams), callback);
  };

  var getSelfLists = function getSelfLists() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var accessToken = arguments[1];
    var callback = arguments[2];

    return getLists('self', params, accessToken, callback);
  };

  var getPhotos = function getPhotos(userId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments[3];

    var method = 'getPhotos';

    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ userId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.callApi(_path2.default.join('/users', userId, 'photos'), accessToken, params, callback);
  };

  var getSelfPhotos = function getSelfPhotos() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var accessToken = arguments[1];
    var callback = arguments[2];

    return getPhotos('self', params, accessToken, callback);
  };

  function getSelfVenueHistory() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var accessToken = arguments[1];
    var callback = arguments[2];

    var method = 'getSelfVenueHistory';
    logger.enter(method);
    logHelper.debugParams(params, method);

    core.callApi('/users/self/venuehistory', accessToken, params, callback);
  }

  var getVenueLikes = function getVenueLikes(userId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments[3];

    var method = 'getVenueLikes';

    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ userId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.callApi(_path2.default.join('/users', userId, 'venuelikes'), accessToken, params, callback);
  };

  var getSelfVenueLikes = function getSelfVenueLikes() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var accessToken = arguments[1];
    var callback = arguments[2];

    return getVenueLikes('self', params, accessToken, callback);
  };

  var getTastes = function getTastes(userId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments[3];

    var method = 'getTastes';

    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ userId }, method, callback)) {
      return;
    }

    core.callApi(_path2.default.join('/users', userId, 'tastes'), accessToken, params, callback);
  };

  var getSelfTastes = function getSelfTastes() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var accessToken = arguments[1];
    var callback = arguments[2];

    return getTastes('self', params, accessToken, callback);
  };

  return {
    getDetails,
    getFriends,
    getLists,
    getPhotos,
    getSelfCheckins,
    getSelfDetails,
    getSelfFriends,
    getSelfLists,
    getSelfPhotos,
    getSelfTastes,
    getSelfVenueHistory,
    getSelfVenueLikes,
    getTastes,
    getVenueLikes,
    search
  };
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

var _locations = require('./util/locations');

var _locations2 = _interopRequireDefault(_locations);

var _logHelper = require('./util/logHelper');

var _logHelper2 = _interopRequireDefault(_logHelper);

var _configDefault = require('./config-default');

var _configDefault2 = _interopRequireDefault(_configDefault);

var _mergeDeep = require('./util/mergeDeep');

var _mergeDeep2 = _interopRequireDefault(_mergeDeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

module.exports = exports['default'];