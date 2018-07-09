'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1, source; i < arguments.length; i++) { source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _path = require('path'),
    _path2 = _interopRequireDefault(_path),
    _core = require('./core'),
    _core2 = _interopRequireDefault(_core),
    _locations = require('./util/locations'),
    _locations2 = _interopRequireDefault(_locations),
    _callbacks = require('./util/callbacks'),
    _logHelper = require('./util/logHelper'),
    _logHelper2 = _interopRequireDefault(_logHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.default = function (config) {
  var core = (0, _core2.default)(config),
      logger = core.getLogger('checkins'),
      logHelper = new _logHelper2.default('Checkins', logger),
      add = function add(venueId, params, accessToken) {
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _callbacks.empty,
        method = 'createCheckin';

    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ venueId }, method, callback)) {
      return;
    }

    var providedParams = params || {},
        location = providedParams.location,
        otherParams = _objectWithoutProperties(providedParams, ['location']),
        locationParams = _locations2.default.getLocationAPIParameter(params, method, 'Checkins', logger, callback);

    logHelper.debugParams(_extends({}, locationParams, otherParams), method);

    core.postApi('/checkins/add', accessToken, _extends({
      venueId
    }, locationParams, otherParams), callback);
  },
      addPost = function addPost(checkinId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _callbacks.empty,
        accessToken = arguments[2],
        method = 'addPost';

    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ checkinId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.postApi(_path2.default.join('/checkins', checkinId, 'addpost'), accessToken, params, callback);
  },
      getDetails = function getDetails(checkinId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        accessToken = arguments[2],
        callback = arguments[3],
        method = 'getDetails';

    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ checkinId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.callApi(_path2.default.join('/checkins', checkinId), accessToken, params, callback);
  },
      like = function like(checkinId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _callbacks.empty,
        accessToken = arguments[2],
        method = 'like';

    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ checkinId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.postApi(_path2.default.join('/checkins', checkinId, 'like'), accessToken, { set: 1 }, callback);
  },
      resolve = function resolve(shortId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        accessToken = arguments[2],
        callback = arguments[3],
        method = 'resolve';

    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ shortId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.callApi('/checkins/resolve', accessToken, { shortId }, callback);
  },
      unlike = function unlike(checkinId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _callbacks.empty,
        accessToken = arguments[2],
        method = 'unlike';

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