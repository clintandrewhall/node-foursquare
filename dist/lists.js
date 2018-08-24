'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
  var providedConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var config = (0, _mergeDeep2.default)(_configDefault2.default, providedConfig || {});
  var core = (0, _core2.default)(config);
  var logger = core.getLogger('lists');
  var logHelper = new _logHelper2.default('Lists', logger);

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
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _callbacks.empty;

    var method = 'create';
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
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var accessToken = arguments[3];
    var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _callbacks.empty;

    var method = 'addItemByVenue';
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
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var accessToken = arguments[3];
    var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _callbacks.empty;

    var method = 'addItemByTip';
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
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var accessToken = arguments[3];
    var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _callbacks.empty;

    var method = 'addItem';
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
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var accessToken = arguments[3];
    var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _callbacks.empty;

    var method = 'shareList';
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