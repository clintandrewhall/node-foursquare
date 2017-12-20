'use strict';

var _extends = Object.assign || function (target) { for (var i = 1, source; i < arguments.length; i++) { source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; },
    qs = require('querystring'),
    util = require('util'),
    https = require('https'),
    urlParser = require('url'),
    winston = require('winston'),
    emptyCallback = function emptyCallback() {};

module.exports = function (config) {
  var loggers = winston.loggers;


  function getLogger(name) {
    if (!loggers.has(name)) {
      var _logger = loggers.add(name, getLoggerSettings(name));
      _logger.setLevels(config.winston.levels);
    }
    return loggers.get(name);
  }

  var logger = getLogger('core');

  function getLoggerSettings(name) {
    var loggerTypes = config.winston.loggers[name] || config.winston.loggers.default;

    if (!loggerTypes) {
      logger.error(`No loggers exist for '${name}', nor is there a default. Update your
        configuration.`);

      loggerTypes = {
        console: {
          level: 'warn'
        }
      };
    }

    var keys = Object.keys(loggerTypes);

    keys.forEach(function (loggerType) {
      loggers[loggerType].label = `node-foursquare:${name}`;
      loggers[loggerType].colorize = true;
    });

    return loggerTypes;
  }

  function retrieve(url) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : emptyCallback,
        method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET',
        parsedURL = urlParser.parse(url, true),
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

    var path = `${pathname}?${qs.stringify(query)}`,
        locale = config.locale || 'en';


    logger.debug(`retrieve: Request path: ${path}`);

    request = https.request({
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
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : emptyCallback,
        method = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'GET',
        parsedURL = urlParser.parse(url, true),
        query = parsedURL.query;

    query = query || {};

    if (!accessToken) {
      query.client_id = config.secrets.clientId;
      query.client_secret = config.secrets.clientSecret;
    } else {
      query.oauth_token = accessToken;
    }

    if (config.foursquare.version) {
      query.v = config.foursquare.version;
    }

    parsedURL.search = `?${qs.stringify(query)}`;
    parsedURL.query = query;
    var newURL = urlParser.format(parsedURL);

    retrieve(newURL, function (error, status, result) {
      if (error) {
        callback(error);
      } else {
        logger.trace(`invokeApi: Result: ${util.inspect(result)}`);
        callback(null, status, result);
      }
    }, method);
  }

  function extract(url, status, result) {
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : emptyCallback,
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
      callback(e);
      return;
    }

    var _json = json,
        meta = _json.meta,
        response = _json.response;


    if (!meta) {
      logger.error(`Response had no metadata: ${util.inspect(json)}`);
      callback(new Error(`Response had no metadata: ${util.inspect(json)}`));
      return;
    }

    var code = meta.code,
        errorDetail = meta.errorDetail,
        errorType = meta.errorType;


    if (!code) {
      logger.error(`Response had no code: ${util.inspect(json)}`);
      callback(new Error(`Response had no code: ${util.inspect(json)}`));
      return;
    } else if (code !== 200) {
      logger.error(`JSON Response had unexpected code: '${code}: ${errorDetail}'`);

      callback(new Error(`${code}: ${errorDetail}`));
      return;
    }

    if (errorType) {
      var _urlParser$parse = urlParser.parse(url),
          pathname = _urlParser$parse.pathname;

      pathname = pathname || '';
      var message = `${pathname} (${errorType}): ${errorDetail}`;

      logger.debug(`extract: Warning level set to ${config.foursquare.warnings}`);

      if (config.foursquare.warnings === 'ERROR') {
        logger.error(message);
        callback(new Error(message));
        return;
      }

      logger.warn(message);
    }

    callback(null, response || {});
  }

  function callApi(path, accessToken, params) {
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : emptyCallback,
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

      url += `?${qs.stringify(queryParams)}`;
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