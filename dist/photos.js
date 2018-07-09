'use strict';

var _path = require('path'),
    _path2 = _interopRequireDefault(_path),
    _core = require('./core'),
    _core2 = _interopRequireDefault(_core),
    _logHelper = require('./util/logHelper'),
    _logHelper2 = _interopRequireDefault(_logHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (config) {
  var core = (0, _core2.default)(config),
      logger = core.getLogger('photos'),
      logHelper = new _logHelper2.default('Photos', logger),
      get = function get(photoId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        accessToken = arguments[2],
        callback = arguments[3],
        method = 'get';

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