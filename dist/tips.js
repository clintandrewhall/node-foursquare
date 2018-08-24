'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var providedConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var config = (0, _mergeDeep2.default)(_configDefault2.default, providedConfig || {});
  var core = (0, _core2.default)(config);
  var logger = core.getLogger('tips');
  var logHelper = new _logHelper2.default('Tips', logger);

  var getDetails = function getDetails(tipId, accessToken, callback) {
    var method = 'getDetails';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ tipId }, method, callback)) {
      return;
    }

    core.callApi(_path2.default.join('/tips', tipId), accessToken, null, callback);
  };

  var add = function add(venueId, text) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var accessToken = arguments[3];
    var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _callbacks.empty;

    var method = 'add';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ venueId, text }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.postApi('/tips/add', accessToken, params, callback);
  };

  return {
    add,
    getDetails
  };
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

var _callbacks = require('./util/callbacks');

var _logHelper = require('./util/logHelper');

var _logHelper2 = _interopRequireDefault(_logHelper);

var _configDefault = require('./config-default');

var _configDefault2 = _interopRequireDefault(_configDefault);

var _mergeDeep = require('./util/mergeDeep');

var _mergeDeep2 = _interopRequireDefault(_mergeDeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];