/* @flow */

const winston = require('winston');

type WinstonLogger = {
  label?: string,
  level?: string,
  colorize?: boolean,
};

export type FoursquareConfig = {
  foursquare: {
    accessTokenUrl: string,
    authenticateUrl: string,
    apiUrl: string,
    mode?: 'swarm' | 'foursquare',
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
    colors?: { [string]: string },
    levels?: { [string]: number },
    loggers?: ?Object,
    transports?: Array<any>,
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
    transports: [
      new winston.transports.Console({
        colorize: true,
        level: 'enter',
        name: 'console',
      }),
    ],
    levels: {
      detail: 6,
      trace: 5,
      debug: 4,
      enter: 3,
      info: 2,
      warn: 1,
      error: 0,
    },
    colors: {
      debug: 'blue',
      detail: 'grey',
      enter: 'inverse',
      error: 'red',
      info: 'green',
      trace: 'white',
      warn: 'yellow',
    },
    loggers: {
      default: {
        console: {
          colorize: true,
          label: 'default',
          level: 'none',
        },
      },
    },
  },
};

module.exports = defaultConfig;
