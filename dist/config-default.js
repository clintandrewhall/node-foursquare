'use strict';

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      transports: [new _winston2.default.transports.Console()]
    }
  }
};

module.exports = defaultConfig;