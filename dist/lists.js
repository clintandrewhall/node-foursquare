'use strict';

var _extends = Object.assign || function (target) { for (var i = 1, source; i < arguments.length; i++) { source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
      logger = core.getLogger('lists'),
      logHelper = new _logHelper2.default('Lists', logger);

  function getByID(listId, accessToken, callback) {
    var method = 'get';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ listId }, method, callback)) {
      return;
    }

    core.callApi(_path2.default.join('/lists', listId), accessToken, null, callback);
  }

  function getByName(userNameOrId, listName, accessToken, callback) {
    var method = 'getByName';

    if (!logHelper.debugAndCheckParams({ userNameOrId, listName }, method, callback)) {
      return;
    }

    core.callApi(_path2.default.join('/lists', userNameOrId, listName), accessToken, null, callback);
  }

  function create(name) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _callbacks.empty,
        accessToken = arguments[2],
        method = 'create';

    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ name }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.postApi('/lists/add', accessToken, _extends({
      name
    }, params), callback);
  }

  function addItemByVenue(listId, venueId) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _callbacks.empty,
        accessToken = arguments[3],
        method = 'addItemByVenue';

    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ listId, venueId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.postApi(_path2.default.join('/lists', listId, 'additem'), accessToken, _extends({
      venueId
    }, params), callback);
  }

  function addItemByTip(listId, tipId) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _callbacks.empty,
        accessToken = arguments[3],
        method = 'addItemByTip';

    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ listId, tipId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.postApi(_path2.default.join('/lists', listId, 'additem'), accessToken, _extends({
      tipId
    }, params), callback);
  }

  function addItem(listId, itemId) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _callbacks.empty,
        accessToken = arguments[3],
        method = 'addItem';

    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ listId, itemId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.postApi(_path2.default.join('/lists', listId, 'additem'), accessToken, _extends({
      itemId
    }, params), callback);
  }

  function shareList(listId, broadcast) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _callbacks.empty,
        accessToken = arguments[3],
        method = 'shareList';

    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ listId, broadcast }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.postApi(_path2.default.join('/lists', listId, 'additem'), accessToken, _extends({
      broadcast
    }, params), callback);
  }

  return {
    addItem,
    addItemByTip,
    addItemByVenue,
    create,
    getByID,
    getByName,
    shareList
  };
};