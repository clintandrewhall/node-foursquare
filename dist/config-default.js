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
    all: {
      level: 'warn',
      transports: [new winston.transports.Console()]
    }
  }
};

module.exports = defaultConfig;