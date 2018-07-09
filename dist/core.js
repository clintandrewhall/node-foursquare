'use strict';

var _extends = Object.assign || function (target) { for (var i = 1, source; i < arguments.length; i++) { source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _querystring = require('querystring'),
    _querystring2 = _interopRequireDefault(_querystring),
    _util = require('util'),
    _util2 = _interopRequireDefault(_util),
    _https = require('https'),
    _https2 = _interopRequireDefault(_https),
    _url = require('url'),
    _url2 = _interopRequireDefault(_url),
    _winston = require('winston'),
    _winston2 = _interopRequireDefault(_winston),
    _events = require('events'),
    _events2 = _interopRequireDefault(_events),
    _callbacks = require('./util/callbacks');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var format = _winston2.default.format,
    combine = format.combine,
    colorize = format.colorize,
    timestamp = format.timestamp,
    label = format.label,
    printf = format.printf,
    levels = {
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

module.exports = function (config) {
  var secrets = config.secrets,
      winston = config.winston,
      clientId = secrets.clientId,
      clientSecret = secrets.clientSecret;


  function getLogger(name) {
    if (!_winston2.default.loggers.has(name)) {
      var maxListeners = _events2.default.defaultMaxListeners;

      _events2.default.defaultMaxListeners = Infinity;
      _winston2.default.loggers.add(name, getLoggerSettings(name));

      _events2.default.defaultMaxListeners = maxListeners;
    }

    return _winston2.default.loggers.get(name);
  }

  var logger = getLogger('core');

  function getLoggerSettings(name) {
    var allConfig = winston['all'] || {
      level: 'warn',
      transports: [new _winston2.default.transports.Console()]
    },
        _ref = winston[name] || allConfig,
        transports = _ref.transports,
        level = _ref.level;

    return {
      format: combine(colorize({ message: true }), label({ label: name }), timestamp(), loggerFormat),
      level,
      levels,
      transports
    };
  }

  function retrieve(url) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _callbacks.empty,
        method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET',
        parsedURL = _url2.default.parse(url, true),
        hostname = parsedURL.hostname,
        protocol = parsedURL.protocol,
        pathname = parsedURL.pathname,
        port = parsedURL.port,
        query = parsedURL.query,
        result = '',
        request = null;

    if (protocol === 'https:' && !port) {
      port = '443';
    }

    query = query || {};
    pathname = pathname || '';

    var path = `${pathname}?${_querystring2.default.stringify(query)}`,
        locale = config.locale || 'en';


    logger.debug(`retrieve: Request path: ${path}`);

    request = _https2.default.request({
      host: hostname,
      port,
      path,
      method,
      headers: {
        'Content-Length': 0,
        'Accept-Language': locale
      }
    }, function (res) {
      res.on('data', function (chunk) {
        result += chunk;
      });
      res.on('end', function () {
        callback(null, res.statusCode, result);
      });
    });

    request.on('error', function (error) {
      logger.error(`retrieve: Error calling remote host: ${error.message}`);
      callback(error);
    });

    request.end();
  }

  function invokeApi(url, accessToken) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _callbacks.empty,
        method = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'GET',
        parsedURL = _url2.default.parse(url, true),
        query = parsedURL.query;

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

    retrieve(newURL, function (error, status, result) {
      if (error) {
        callback(error);
      } else {
        logger.trace(`invokeApi: Result: ${_util2.default.inspect(result)}`);
        callback(null, status, result);
      }
    }, method);
  }

  function extract(url, status, result) {
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _callbacks.empty,
        json = null;


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

  function callApi(path, accessToken, params) {
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _callbacks.empty,
        method = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'GET',
        url = config.foursquare.apiUrl + path,
        queryParams = _extends({}, params);

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

    invokeApi(url, accessToken, function (error, status, result) {
      extract(url, status, result, callback);
    }, method);
  }

  function postApi(path, accessToken, params, callback) {
    callApi(path, accessToken, params, callback, 'POST');
  }

  return {
    getLogger,
    retrieve,
    invokeApi,
    extract,
    callApi,
    postApi
  };
};