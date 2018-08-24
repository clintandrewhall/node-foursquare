'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelPolyfill = require('babel-polyfill');

var _babelPolyfill2 = _interopRequireDefault(_babelPolyfill);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _callbacks = require('./util/callbacks');

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

var _configDefault = require('./config-default');

var _configDefault2 = _interopRequireDefault(_configDefault);

var _mergeDeep = require('./util/mergeDeep');

var _mergeDeep2 = _interopRequireDefault(_mergeDeep);

var _checkins = require('./checkins');

var _checkins2 = _interopRequireDefault(_checkins);

var _lists = require('./lists');

var _lists2 = _interopRequireDefault(_lists);

var _photos = require('./photos');

var _photos2 = _interopRequireDefault(_photos);

var _tips = require('./tips');

var _tips2 = _interopRequireDefault(_tips);

var _users = require('./users');

var _users2 = _interopRequireDefault(_users);

var _venues = require('./venues');

var _venues2 = _interopRequireDefault(_venues);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var version = '07102018';

exports.default = function () {
  var getAccessToken = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(providedParams) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _callbacks.empty;
      var code, params, response, ok, result, access_token;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              code = providedParams.code;
              params = {
                code,
                grant_type: providedParams.grant_type || 'authorization_code',
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUrl
              };
              _context.next = 4;
              return (0, _nodeFetch2.default)(`${accessTokenUrl}?${_querystring2.default.stringify(params)}`);

            case 4:
              response = _context.sent;
              ok = response.ok;
              _context.next = 8;
              return response.json();

            case 8:
              result = _context.sent;

              if (!ok) {
                _context.next = 16;
                break;
              }

              access_token = result.access_token;

              if (!access_token) {
                _context.next = 14;
                break;
              }

              callback(null, result.access_token);
              return _context.abrupt('return');

            case 14:
              callback(new Error(`access_token not present, got ${result}`));
              return _context.abrupt('return');

            case 16:

              callback(new Error(result.error));

            case 17:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function getAccessToken(_x2) {
      return _ref.apply(this, arguments);
    };
  }();

  var providedConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var config = (0, _mergeDeep2.default)(_configDefault2.default, providedConfig || {});
  var core = (0, _core2.default)(config);
  var logger = core.getLogger('all');

  if (!config.secrets || !config.secrets.clientId || !config.secrets.clientSecret || !config.secrets.redirectUrl) {
    logger.error(`Client configuration not supplied; add config.secrets information,
      (clientId, clientSecret, redirectUrl).`);
    throw new Error('Configuration Error: Client information not supplied.');
  }

  if (!config.foursquare.accessTokenUrl || !config.foursquare.apiUrl) {
    logger.error(`Foursquare configuration not supplied; add config.foursquare
      information, (accessTokenUrl, apiUrl)`);
    throw new TypeError('Configuration Error: Foursquare information not supplied.');
  }

  if (!config.foursquare.version) {
    config.foursquare.version = version;
    logger.warn(`Foursquare API version not defined in configuration; defaulting to
      latest: ${config.foursquare.version}`);
  }

  var foursquare = config.foursquare,
      secrets = config.secrets;
  var clientId = secrets.clientId,
      clientSecret = secrets.clientSecret,
      redirectUrl = secrets.redirectUrl;
  var accessTokenUrl = foursquare.accessTokenUrl,
      authenticateUrl = foursquare.authenticateUrl;

  function getAuthClientRedirectUrl() {
    return `${authenticateUrl}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUrl}`;
  }

  return {
    Users: (0, _users2.default)(config),
    Venues: (0, _venues2.default)(config),
    Checkins: (0, _checkins2.default)(config),
    Tips: (0, _tips2.default)(config),
    Lists: (0, _lists2.default)(config),
    Photos: (0, _photos2.default)(config),
    getAccessToken,
    getAuthClientRedirectUrl
  };
};

module.exports = exports['default'];