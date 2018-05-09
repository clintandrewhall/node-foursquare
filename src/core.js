/* @flow */

import type {CallbackFunction, ServerCallbackFunction} from './util/callbacks';

const qs = require('querystring');
const util = require('util');
const https = require('https');
const urlParser = require('url');
const winston = require('winston');

const emptyCallback = () => {};

/**
 * Construct the Core module.
 * @param {Object} config A valid configuration.
 */
module.exports = (
  config: Object,
): {
  getLogger: Function,
  retrieve: Function,
  invokeApi: Function,
  extract: Function,
  callApi: Function,
  postApi: Function,
} => {
  const {loggers} = winston;

  function getLogger(name: string): any {
    if (!loggers.has(name)) {
      // eslint-disable-next-line no-use-before-define
      const logger = loggers.add(name, getLoggerSettings(name));
      logger.setLevels(config.winston.levels);
    }
    return loggers.get(name);
  }

  const logger = getLogger('core');

  function getLoggerSettings(name: string): any {
    let loggerTypes =
      config.winston.loggers[name] || config.winston.loggers.default;

    if (!loggerTypes) {
      logger.error(
        `No loggers exist for '${name}', nor is there a default. Update your
        configuration.`,
      );

      loggerTypes = {
        console: {
          level: 'warn',
        },
      };
    }

    const keys = Object.keys(loggerTypes);

    keys.forEach(loggerType => {
      loggers[loggerType].label = `node-foursquare:${name}`;
      loggers[loggerType].colorize = true;
    });

    return loggerTypes;
  }

  function retrieve(
    url: string,
    callback: ServerCallbackFunction = emptyCallback,
    method: 'POST' | 'GET' = 'GET',
  ) {
    const parsedURL = urlParser.parse(url, true);
    const {hostname, protocol} = parsedURL;
    let {pathname, port, query} = parsedURL;
    let result = '';
    let request = null;

    if (protocol === 'https:' && !port) {
      port = '443';
    }

    query = query || {};
    pathname = pathname || '';

    const path = `${pathname}?${qs.stringify(query)}`;
    const locale = config.locale || 'en';

    logger.debug(`retrieve: Request path: ${path}`);

    request = https.request(
      {
        host: hostname,
        port,
        path,
        method,
        headers: {
          'Content-Length': 0,
          'Accept-Language': locale,
        },
      },
      res => {
        res.on('data', chunk => {
          result += chunk;
        });
        res.on('end', () => {
          callback(null, res.statusCode, result);
        });
      },
    );

    request.on('error', error => {
      logger.error(`retrieve: Error calling remote host: ${error.message}`);
      callback(error);
    });

    request.end();
  }

  function invokeApi(
    url: string,
    accessToken: string,
    callback: ServerCallbackFunction = emptyCallback,
    method: 'POST' | 'GET' = 'GET',
  ) {
    const parsedURL = urlParser.parse(url, true);
    let {query} = parsedURL;
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
    const newURL = urlParser.format(parsedURL);

    retrieve(
      newURL,
      (error, status, result) => {
        if (error) {
          callback(error);
        } else {
          logger.trace(`invokeApi: Result: ${util.inspect(result)}`);
          callback(null, status, result);
        }
      },
      method,
    );
  }

  function extract(
    url: string,
    status,
    result,
    callback: CallbackFunction = emptyCallback,
  ) {
    let json = null;

    if (!status || !result) {
      logger.error(
        `There was an unexpected, fatal error calling Foursquare: the response
        was undefined or had no status code.`,
      );
      callback(new Error('Foursquare had no response or status code.'));
      return;
    }

    try {
      json = JSON.parse(result);
    } catch (e) {
      callback(status);
      return;
    }

    const {meta, response} = json;

    if (!meta) {
      logger.error(`Response had no metadata: ${util.inspect(json)}`);
      callback(new Error(`Response had no metadata: ${util.inspect(json)}`));
      return;
    }

    const {code, errorDetail, errorType} = meta;

    if (!code) {
      logger.error(`Response had no code: ${util.inspect(json)}`);
      callback(new Error(`Response had no code: ${util.inspect(json)}`));
      return;
    } else if (code !== 200) {
      logger.error(
        `JSON Response had unexpected code: '${code}: ${errorDetail}'`,
      );

      callback(new Error(`${code}: ${errorDetail}`));
      return;
    }

    if (errorType) {
      let {pathname} = urlParser.parse(url);
      pathname = pathname || '';
      const message = `${pathname} (${errorType}): ${errorDetail}`;

      logger.debug(
        `extract: Warning level set to ${config.foursquare.warnings}`,
      );

      if (config.foursquare.warnings === 'ERROR') {
        logger.error(message);
        callback(new Error(message));
        return;
      }

      logger.warn(message);
    }

    callback(null, response || {});
  }

  function callApi(
    path: string,
    accessToken: string,
    params: Object,
    callback: CallbackFunction = emptyCallback,
    method: 'GET' | 'POST' = 'GET',
  ): void {
    let url = config.foursquare.apiUrl + path;
    const queryParams = {...params};

    if (queryParams) {
      if (
        (queryParams.lat && !queryParams.lng) ||
        (!queryParams.lat && queryParams.lng)
      ) {
        callback(
          new Error(
            `callApi:parameters: if you specify a longitude or latitude, you
            must include BOTH.`,
          ),
        );
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

    invokeApi(
      url,
      accessToken,
      (error, status, result) => {
        extract(url, status, result, callback);
      },
      method,
    );
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
    postApi,
  };
};
