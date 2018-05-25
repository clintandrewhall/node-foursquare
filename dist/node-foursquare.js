'use strict';

var qs = require('querystring'),
    winstonLib = require('winston'),
    defaultConfig = require('./config-default'),
    mergeDeep = require('./util/mergeDeep'),
    coreLib = require('./core'),
    _require = require('./util/callbacks'),
    empty = _require.empty,
    users = require('./users'),
    venues = require('./venues'),
    checkins = require('./checkins'),
    tips = require('./tips'),
    lists = require('./lists'),
    photos = require('./photos'),
    settings = require('./settings'),
    specials = require('./specials'),
    updates = require('./updates'),
    events = require('./events'),
    version = '12122017';

module.exports = function () {
  var providedConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      config = mergeDeep(providedConfig || {}, defaultConfig),
      winston = config.winston,
      colors = winston.colors,
      levels = winston.levels;


  winstonLib.addColors(colors);

  var logger = new winstonLib.Logger(winston);
  logger.setLevels(levels);

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

  var core = coreLib(config),
      foursquare = config.foursquare,
      secrets = config.secrets,
      clientId = secrets.clientId,
      clientSecret = secrets.clientSecret,
      redirectUrl = secrets.redirectUrl,
      accessTokenUrl = foursquare.accessTokenUrl,
      authenticateUrl = foursquare.authenticateUrl;
  function getAccessToken(providedParams) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : empty,
        code = providedParams.code,
        params = {
      code,
      grant_type: providedParams.grant_type || 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUrl
    };


    core.retrieve(`${accessTokenUrl}?${qs.stringify(params)}`, function (error, status, result) {
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
    return `${authenticateUrl}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUrl}`;
  }

  return {
    Users: users(config),
    Venues: venues(config),
    Checkins: checkins(config),
    Tips: tips(config),
    Lists: lists(config),
    Photos: photos(config),
    Settings: settings(config),
    Specials: specials(config),
    Updates: updates(config),
    Events: events(config),
    getAccessToken,
    getAuthClientRedirectUrl
  };
};