/* @flow */

import type {
  CallbackFunction,
  ServerCallbackFunction,
} from './util/callbacks';
import type { FoursquareConfig, WinstonLoggerName } from './config-default';

import qs from 'querystring';
import util from 'util';
import https from 'https';
import urlParser from 'url';
import winstonLib from 'winston';
import EventEmitter from 'events';

import { empty } from './util/callbacks';

const { format } = winstonLib;
const { combine, colorize, timestamp, label, printf } = format;

const levels: $winstonLevels = {
  detail: 6,
  trace: 5,
  debug: 4,
  enter: 3,
  info: 2,
  warn: 1,
  error: 0,
};

// $FlowFixMe$
winstonLib.addColors({
  debug: 'blue',
  detail: 'grey',
  enter: 'inverse',
  error: 'red',
  info: 'green',
  trace: 'white',
  warn: 'yellow',
});

const loggerFormat = printf(info => {
  // $FlowFixMe$ Winston library incorrect
  return `${info.timestamp} ${info.level}: [${info.label}] ${info.message}`;
});

/**
 * Construct the Core module.
 * @param {Object} config A valid configuration.
 */
module.exports = (
  config: FoursquareConfig
): {
  getLogger: Function,
  retrieve: Function,
  invokeApi: Function,
  extract: Function,
  callApi: Function,
  postApi: Function,
} => {
  const { secrets, winston } = config;
  const { clientId, clientSecret } = secrets;

  function getLogger(name: WinstonLoggerName): any {
    // In order to avoid emitter leak warnings, and not affect the global
    // setting or outer warnings, I'm setting the defaultMaxListeners before
    // and after creating a new logger.

    // $FlowFixMe$ Winston flow-type definition is missing 'has()'
    if (!winstonLib.loggers.has(name)) {
      // $FlowFixMe$ Flow isn't up-to-date on defaultMaxListeners
      const maxListeners = EventEmitter.defaultMaxListeners;
      // $FlowFixMe$ Flow isn't up-to-date on defaultMaxListeners
      EventEmitter.defaultMaxListeners = Infinity;
      winstonLib.loggers.add(name, getLoggerSettings(name));
      // $FlowFixMe$ Flow isn't up-to-date on defaultMaxListeners
      EventEmitter.defaultMaxListeners = maxListeners;
    }

    return winstonLib.loggers.get(name);
  }

  const logger = getLogger('core');

  function getLoggerSettings(
    name: WinstonLoggerName
  ): $winstonLoggerConfig<$winstonLevels> {
    const allConfig = winston['all'] || {
      level: 'warn',
      transports: [new winstonLib.transports.Console()],
    };

    const { transports, level } = winston[name] || allConfig;

    return {
      format: combine(
        // $FlowFixMe$ Winston library incorrect
        colorize({ message: true }),
        label({ label: name }),
        timestamp(),
        loggerFormat
      ),
      level,
      levels,
      transports,
    };
  }

  function retrieve(
    url: string,
    callback: ServerCallbackFunction = empty,
    method: 'POST' | 'GET' = 'GET'
  ) {
    const parsedURL = urlParser.parse(url, true);
    const { hostname, protocol } = parsedURL;
    let { pathname, port, query } = parsedURL;
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
      }
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
    callback: ServerCallbackFunction = empty,
    method: 'POST' | 'GET' = 'GET'
  ) {
    const parsedURL = urlParser.parse(url, true);
    let { query } = parsedURL;
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
      method
    );
  }

  function extract(
    url: string,
    status,
    result,
    callback: CallbackFunction = empty
  ) {
    let json = null;

    if (!status || !result) {
      logger.error(
        `There was an unexpected, fatal error calling Foursquare: the response
        was undefined or had no status code.`
      );
      callback(new Error('Foursquare had no response or status code.'));
      return;
    }

    try {
      json = JSON.parse(result);
    } catch (e) {
      callback({
        status,
        error: e,
      });
      return;
    }

    const { meta, response } = json;

    if (!meta) {
      logger.error(`Response had no metadata: ${util.inspect(json)}`);
      callback({
        status,
        error: new Error(`Response had no metadata: ${util.inspect(json)}`),
      });
      return;
    }

    const { code, errorDetail, errorType } = meta;

    if (!code) {
      logger.error(`Response had no code: ${util.inspect(json)}`);
      callback({
        status,
        error: new Error(`Response had no code: ${util.inspect(json)}`),
      });
      return;
    } else if (code !== 200) {
      logger.error(
        `JSON Response had unexpected code: '${code}: ${errorDetail}'`
      );

      callback({
        status,
        error: new Error(`${code}: ${errorDetail}`),
      });
      return;
    }

    if (errorType) {
      let { pathname } = urlParser.parse(url);
      pathname = pathname || '';
      const message = `${pathname} (${errorType}): ${errorDetail}`;

      logger.debug(
        `extract: Warning level set to ${config.foursquare.warnings}`
      );

      if (config.foursquare.warnings === 'ERROR') {
        logger.error(message);
        callback({
          status,
          error: new Error(message),
        });
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
    callback: CallbackFunction = empty,
    method: 'GET' | 'POST' = 'GET'
  ): void {
    let url = config.foursquare.apiUrl + path;
    const queryParams = { ...params };

    if (queryParams) {
      if (
        (queryParams.lat && !queryParams.lng) ||
        (!queryParams.lat && queryParams.lng)
      ) {
        callback(
          new Error(
            `callApi:parameters: if you specify a longitude or latitude, you
            must include BOTH.`
          )
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
      method
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
