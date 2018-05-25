'use strict';

var winston = require('winston');

var defaultConfig = {
  foursquare: {
    accessTokenUrl: 'https://foursquare.com/oauth2/access_token',
    authenticateUrl: 'https://foursquare.com/oauth2/authenticate',
    apiUrl: 'https://api.foursquare.com/v2',

    version: '20180516',

    warnings: 'WARN'
  },
  locale: 'en',
  secrets: {
    clientId: '',
    clientSecret: '',
    redirectUrl: ''
  },
  winston: {
    transports: [new winston.transports.Console({
      colorize: true,
      level: 'enter',
      name: 'console'
    })],
    levels: {
      detail: 6,
      trace: 5,
      debug: 4,
      enter: 3,
      info: 2,
      warn: 1,
      error: 0
    },
    colors: {
      debug: 'blue',
      detail: 'grey',
      enter: 'inverse',
      error: 'red',
      info: 'green',
      trace: 'white',
      warn: 'yellow'
    },
    loggers: {
      default: {
        console: {
          colorize: true,
          label: 'default',
          level: 'none'
        }
      }
    }
  }
};

module.exports = defaultConfig;