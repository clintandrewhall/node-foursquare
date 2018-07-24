/* @flow */

import winston from 'winston';

import { $winstonTransport } from 'winston';

export type WinstonLoggerName =
  | 'all'
  | 'checkins'
  | 'core'
  | 'events'
  | 'lists'
  | 'photos'
  | 'tips'
  | 'users'
  | 'venues';

export type WinstonLoggerLevel =
  | 'detail'
  | 'trace'
  | 'debug'
  | 'enter'
  | 'info'
  | 'warn'
  | 'error';

export type WinstonLoggerConfig = {
  level: WinstonLoggerLevel,
  transports: Array<$winstonTransport>,
};

export type FoursquareConfig = {
  foursquare: {
    accessTokenUrl: string,
    authenticateUrl: string,
    apiUrl: string,
    version?: string,
    warnings: 'WARN' | 'ERROR',
  },
  locale: string,
  secrets: {
    clientId: string,
    clientSecret: string,
    redirectUrl: string,
  },
  winston: {
    [WinstonLoggerName]: WinstonLoggerConfig,
  },
};

const defaultConfig: FoursquareConfig = {
  foursquare: {
    accessTokenUrl: 'https://foursquare.com/oauth2/access_token',
    authenticateUrl: 'https://foursquare.com/oauth2/authenticate',
    apiUrl: 'https://api.foursquare.com/v2',
    /*
      This field will indicate which version of the Foursquare API you wish to
      call. If not specified it will use the last publish date of this library.
     */
    version: '20180516',
    /*
      This field determines how this library handles endpoints that return
      results along with an error, (e.g. deprecations).
        - If set to 'WARN' (default), log4js will write a warning to the log,
          (NOTE: You must raise the 'node-foursquare.core' level to WARN
          or lower in order to see these warnings.
        - If set to 'ERROR', the library will behave as though it encountered
          an ERROR and not return results.
     */
    warnings: 'WARN',
  },
  locale: 'en',
  secrets: {
    clientId: '',
    clientSecret: '',
    redirectUrl: '',
  },
  winston: {
    all: {
      level: 'warn',
      transports: [new winston.transports.Console()],
    },
  },
};

module.exports = defaultConfig;
