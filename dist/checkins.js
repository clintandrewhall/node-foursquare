'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
  var providedConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var config = (0, _mergeDeep2.default)(_configDefault2.default, providedConfig || {});
  var core = (0, _core2.default)(config);
  var logger = core.getLogger('checkins');
  var logHelper = new _logHelper2.default('Checkins', logger);

  var add = function add(venueId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _callbacks.empty;

    var method = 'createCheckin';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ venueId }, method, callback)) {
      return;
    }

    var providedParams = params || {};

    var location = providedParams.location,
        otherParams = _objectWithoutProperties(providedParams, ['location']);

    var locationParams = _locations2.default.getLocationAPIParameter(params, method, 'Checkins', logger, callback);

    logHelper.debugParams(_extends({}, locationParams, otherParams), method);

    core.postApi('/checkins/add', accessToken, _extends({
      venueId
    }, locationParams, otherParams), callback);
  };

  var addPost = function addPost(checkinId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _callbacks.empty;

    var method = 'addPost';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ checkinId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.postApi(_path2.default.join('/checkins', checkinId, 'addpost'), accessToken, params, callback);
  };

  var getDetails = function getDetails(checkinId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments[3];

    var method = 'getDetails';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ checkinId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.callApi(_path2.default.join('/checkins', checkinId), accessToken, params, callback);
  };

  var like = function like(checkinId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _callbacks.empty;

    var method = 'like';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ checkinId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.postApi(_path2.default.join('/checkins', checkinId, 'like'), accessToken, { set: 1 }, callback);
  };

  var resolve = function resolve(shortId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments[3];

    var method = 'resolve';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ shortId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.callApi('/checkins/resolve', accessToken, { shortId }, callback);
  };

  var unlike = function unlike(checkinId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _callbacks.empty;

    var method = 'unlike';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ checkinId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.postApi(_path2.default.join('/checkins', checkinId, 'like'), accessToken, { set: 0 }, callback);
  };

  return {
    add,
    addPost,
    getDetails,
    like,
    resolve,
    unlike
  };
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

var _locations = require('./util/locations');

var _locations2 = _interopRequireDefault(_locations);

var _callbacks = require('./util/callbacks');

var _configDefault = require('./config-default');

var _configDefault2 = _interopRequireDefault(_configDefault);

var _logHelper = require('./util/logHelper');

var _logHelper2 = _interopRequireDefault(_logHelper);

var _mergeDeep = require('./util/mergeDeep');

var _mergeDeep2 = _interopRequireDefault(_mergeDeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

module.exports = exports['default'];