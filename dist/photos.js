'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var providedConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var config = (0, _mergeDeep2.default)(_configDefault2.default, providedConfig || {});
  var core = (0, _core2.default)(config);
  var logger = core.getLogger('photos');
  var logHelper = new _logHelper2.default('Photos', logger);

  var get = function get(photoId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments[3];

    var method = 'get';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ photoId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.callApi(_path2.default.join('/photos', photoId), accessToken, null, callback);
  };

  return {
    get
  };
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

var _logHelper = require('./util/logHelper');

var _logHelper2 = _interopRequireDefault(_logHelper);

var _configDefault = require('./config-default');

var _configDefault2 = _interopRequireDefault(_configDefault);

var _mergeDeep = require('./util/mergeDeep');

var _mergeDeep2 = _interopRequireDefault(_mergeDeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];