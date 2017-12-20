'use strict';

var winston = require('winston');

var defaultConfig = {
  foursquare: {
    accessTokenUrl: 'https://foursquare.com/oauth2/access_token',
    authenticateUrl: 'https://foursquare.com/oauth2/authenticate',
    apiUrl: 'https://api.foursquare.com/v2'
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
      detail: 'grey',
      trace: 'white',
      debug: 'blue',
      enter: 'inverse',
      info: 'green',
      warn: 'yellow',
      error: 'red'
    },
    loggers: {
      default: {
        console: {
          level: 'none'
        }
      }
    }
  },
  secrets: {}
};

module.exports = defaultConfig;