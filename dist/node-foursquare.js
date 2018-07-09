'use strict';

var _querystring = require('querystring'),
    _querystring2 = _interopRequireDefault(_querystring),
    _configDefault = require('./config-default'),
    _configDefault2 = _interopRequireDefault(_configDefault),
    _mergeDeep = require('./util/mergeDeep'),
    _mergeDeep2 = _interopRequireDefault(_mergeDeep),
    _core = require('./core'),
    _core2 = _interopRequireDefault(_core),
    _callbacks = require('./util/callbacks'),
    _users = require('./users'),
    _users2 = _interopRequireDefault(_users),
    _venues = require('./venues'),
    _venues2 = _interopRequireDefault(_venues),
    _checkins = require('./checkins'),
    _checkins2 = _interopRequireDefault(_checkins),
    _tips = require('./tips'),
    _tips2 = _interopRequireDefault(_tips),
    _lists = require('./lists'),
    _lists2 = _interopRequireDefault(_lists),
    _photos = require('./photos'),
    _photos2 = _interopRequireDefault(_photos);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var version = '12122017';

module.exports = function () {
  var providedConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      config = (0, _mergeDeep2.default)(_configDefault2.default, providedConfig || {}),
      core = (0, _core2.default)(config),
      logger = core.getLogger('all');


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

  if (!config.foursquare.mode) {
    config.foursquare.mode = 'foursquare';
    logger.warn(`Foursquare API mode not defined in configuration; defaulting to: ${config.foursquare.mode}`);
  }

  var foursquare = config.foursquare,
      secrets = config.secrets,
      clientId = secrets.clientId,
      clientSecret = secrets.clientSecret,
      redirectUrl = secrets.redirectUrl,
      accessTokenUrl = foursquare.accessTokenUrl,
      authenticateUrl = foursquare.authenticateUrl;

  function getAccessToken(providedParams) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _callbacks.empty,
        code = providedParams.code,
        params = {
      code,
      grant_type: providedParams.grant_type || 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUrl
    };


    core.retrieve(`${accessTokenUrl}?${_querystring2.default.stringify(params)}`, function (error, status, result) {
      if (error) {
        callback(error);
      } else {
        try {
          var resultObj = JSON.parse(result);

          if (resultObj.error) {
            callback(new Error(resultObj.error));
          } else if (!resultObj.access_token) {
            callback(new Error(`access_token not present, got ${result}`));
          } else {
            callback(null, resultObj.access_token);
          }
        } catch (e) {
          callback(e);
        }
      }
    });
  }

  function getAuthClientRedirectUrl() {
    return `${authenticateUrl}?client_id=${clientId}&response_type=code
      &redirect_uri=${redirectUrl}`;
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