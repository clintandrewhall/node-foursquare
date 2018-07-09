'use strict';

var _path = require('path'),
    _path2 = _interopRequireDefault(_path),
    _core = require('./core'),
    _core2 = _interopRequireDefault(_core),
    _callbacks = require('./util/callbacks'),
    _logHelper = require('./util/logHelper'),
    _logHelper2 = _interopRequireDefault(_logHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (config) {
  var core = (0, _core2.default)(config),
      logger = core.getLogger('tips'),
      logHelper = new _logHelper2.default('Tips', logger),
      getDetails = function getDetails(tipId, accessToken, callback) {
    var method = 'getDetails';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ tipId }, method, callback)) {
      return;
    }

    core.callApi(_path2.default.join('/tips', tipId), accessToken, null, callback);
  },
      add = function add(venueId, text) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _callbacks.empty,
        accessToken = arguments[3],
        method = 'add';

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