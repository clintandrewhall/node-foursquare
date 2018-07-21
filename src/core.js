/* @ flow */

import type {
  CallbackFunction,
  ServerCallbackFunction,
} from './util/callbacks';

import type { FoursquareConfig, WinstonLoggerName } from './config-default';
import type {
  $winstonLevels,
  $winstonLogger,
  $winstonLoggerConfig,
} from 'winston';

import qs from 'querystring';
import util from 'util';
import urlParser from 'url';
import winstonLib from 'winston';
import EventEmitter from 'events';
import request from 'request';

import { empty } from './util/callbacks';
import defaultConfig from './config-default';
import mergeDeep from './util/mergeDeep';

type Key = number | string;
type Value = any;
type Params = { [key: Key]: Value };

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
  return `${info.timestamp} ${info.level}: [${info.label}] ${info.message}`;
});

/**
 * Construct the Core module.
 */
export default function(providedConfig: Object | FoursquareConfig = {}) {
  const config = (mergeDeep(
    defaultConfig,
    providedConfig || {}
  ): FoursquareConfig);
  const { secrets, winston } = config;
  const { clientId, clientSecret } = secrets;

  const getLogger = (
    name: WinstonLoggerName
  ): $winstonLogger<$winstonLevels> => {
    // In order to avoid emitter leak warnings, and not affect the global
    // setting or outer warnings, I'm setting the defaultMaxListeners before
    // and after creating a new logger.

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
  };

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

  const invokeApi = (
    url: string,
    accessToken: ?string,
    callback: ServerCallbackFunction = empty,
    method: 'POST' | 'GET' = 'GET'
  ) => {
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

    const requestFunction = method === 'POST' ? request.post : request.get;

    requestFunction(newURL, (error, response, body) => {
      const { statusCode } = response;

      if (error) {
        callback(error, statusCode);
      } else {
        logger.detail(`invokeApi: Result: ${util.inspect(body)}`);
        callback(null, statusCode, body);
      }
    });
  };

  function extract(
    url: string,
    status: number,
    result: string = '',
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
    accessToken: ?string,
    params: ?Params = {},
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
      (error, status, result = '') => {
        extract(url, status, result, callback);
      },
      method
    );
  }

  function postApi(
    path: string,
    accessToken: ?string,
    params: ?Params = {},
    callback: CallbackFunction
  ) {
    callApi(path, accessToken, params, callback, 'POST');
  }

  return {
    getLogger,
    callApi,
    postApi,
  };
}
