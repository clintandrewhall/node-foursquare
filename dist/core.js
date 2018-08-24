'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
  var providedConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var config = (0, _mergeDeep2.default)(_configDefault2.default, providedConfig || {});
  var secrets = config.secrets,
      winston = config.winston;
  var clientId = secrets.clientId,
      clientSecret = secrets.clientSecret;


  var getLogger = function getLogger(name) {

    if (!_winston2.default.loggers.has(name)) {
      var maxListeners = _events2.default.defaultMaxListeners;

      _events2.default.defaultMaxListeners = Infinity;
      _winston2.default.loggers.add(name, getLoggerSettings(name));

      _events2.default.defaultMaxListeners = maxListeners;
    }

    return _winston2.default.loggers.get(name);
  };

  var logger = getLogger('core');

  function getLoggerSettings(name) {
    var allConfig = winston['all'] || {
      level: 'warn',
      transports: [new _winston2.default.transports.Console()]
    };

    var _ref = winston[name] || allConfig,
        transports = _ref.transports,
        level = _ref.level;

    return {
      format: combine(colorize({ message: true }), label({ label: name }), timestamp(), loggerFormat),
      level,
      levels,
      transports
    };
  }

  var invokeApi = function invokeApi(url, accessToken) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _callbacks.empty;
    var method = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'GET';

    var parsedURL = _url2.default.parse(url, true);
    var query = parsedURL.query;

    query = query || {};

    if (!accessToken) {
      query.client_id = clientId;
      query.client_secret = clientSecret;
    } else {
      query.oauth_token = accessToken;
    }

    if (config.foursquare.version) {
      query.v = config.foursquare.version;
    }

    parsedURL.search = `?${_querystring2.default.stringify(query)}`;
    parsedURL.query = query;
    var newURL = _url2.default.format(parsedURL);

    var requestFunction = method === 'POST' ? _request2.default.post : _request2.default.get;

    requestFunction(newURL, function (error, response, body) {
      var statusCode = response.statusCode;


      if (error) {
        callback(error, statusCode);
      } else {
        logger.detail(`invokeApi: Result: ${_util2.default.inspect(body)}`);
        callback(null, statusCode, body);
      }
    });
  };

  function extract(url, status) {
    var result = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _callbacks.empty;

    var json = null;

    if (!status || !result) {
      logger.error(`There was an unexpected, fatal error calling Foursquare: the response
        was undefined or had no status code.`);
      callback(new Error('Foursquare had no response or status code.'));
      return;
    }

    try {
      json = JSON.parse(result);
    } catch (e) {
      callback({
        status,
        error: e
      });
      return;
    }

    var _json = json,
        meta = _json.meta,
        response = _json.response;


    if (!meta) {
      logger.error(`Response had no metadata: ${_util2.default.inspect(json)}`);
      callback({
        status,
        error: new Error(`Response had no metadata: ${_util2.default.inspect(json)}`)
      });
      return;
    }

    var code = meta.code,
        errorDetail = meta.errorDetail,
        errorType = meta.errorType;


    if (!code) {
      logger.error(`Response had no code: ${_util2.default.inspect(json)}`);
      callback({
        status,
        error: new Error(`Response had no code: ${_util2.default.inspect(json)}`)
      });
      return;
    } else if (code !== 200) {
      logger.error(`JSON Response had unexpected code: '${code}: ${errorDetail}'`);

      callback({
        status,
        error: new Error(`${code}: ${errorDetail}`)
      });
      return;
    }

    if (errorType) {
      var _urlParser$parse = _url2.default.parse(url),
          pathname = _urlParser$parse.pathname;

      pathname = pathname || '';
      var message = `${pathname} (${errorType}): ${errorDetail}`;

      logger.debug(`extract: Warning level set to ${config.foursquare.warnings}`);

      if (config.foursquare.warnings === 'ERROR') {
        logger.error(message);
        callback({
          status,
          error: new Error(message)
        });
        return;
      }

      logger.warn(message);
    }

    callback(null, response || {});
  }

  function callApi(path, accessToken) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _callbacks.empty;
    var method = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'GET';

    var url = config.foursquare.apiUrl + path;
    var queryParams = _extends({}, params);

    if (queryParams) {
      if (queryParams.lat && !queryParams.lng || !queryParams.lat && queryParams.lng) {
        callback(new Error(`callApi:parameters: if you specify a longitude or latitude, you
            must include BOTH.`));
        return;
      }

      if (queryParams.lat && queryParams.lng) {
        queryParams.ll = `${queryParams.lat},${queryParams.lng}`;
        delete queryParams.lat;
        delete queryParams.lng;
      }

      url += `?${_querystring2.default.stringify(queryParams)}`;
    }

    logger.trace(`callApi: Request URL: ${url}`);

    invokeApi(url, accessToken, function (error, status) {
      var result = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

      extract(url, status, result, callback);
    }, method);
  }

  function postApi(path, accessToken) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var callback = arguments[3];

    callApi(path, accessToken, params, callback, 'POST');
  }

  return {
    getLogger,
    callApi,
    postApi
  };
};

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _callbacks = require('./util/callbacks');

var _configDefault = require('./config-default');

var _configDefault2 = _interopRequireDefault(_configDefault);

var _mergeDeep = require('./util/mergeDeep');

var _mergeDeep2 = _interopRequireDefault(_mergeDeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var format = _winston2.default.format;
var combine = format.combine,
    colorize = format.colorize,
    timestamp = format.timestamp,
    label = format.label,
    printf = format.printf;


var levels = {
  detail: 6,
  trace: 5,
  debug: 4,
  enter: 3,
  info: 2,
  warn: 1,
  error: 0
};

_winston2.default.addColors({
  debug: 'blue',
  detail: 'grey',
  enter: 'inverse',
  error: 'red',
  info: 'green',
  trace: 'white',
  warn: 'yellow'
});

var loggerFormat = printf(function (info) {
  return `${info.timestamp} ${info.level}: [${info.label}] ${info.message}`;
});

module.exports = exports['default'];