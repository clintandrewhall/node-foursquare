/* @flow */

/**
 * A NodeJS module for interfacing with Foursquare.
 * @module node-foursquare
 * @author Clint Andrew Hall
 * @description A NodeJS module for interacting with Foursquare.
 */
import type {CallbackFunction} from './util/callbacks';

const qs = require('querystring');
const winstonLib = require('winston');

const defaultConfig = require('./config-default');
const mergeDeep = require('./util/mergeDeep');
const coreLib = require('./core');
const {empty} = require('./util/callbacks');

const users = require('./users');
const venues = require('./venues');
const checkins = require('./checkins');
const tips = require('./tips');
const lists = require('./lists');
const photos = require('./photos');
const settings = require('./settings');
const specials = require('./specials');
const updates = require('./updates');
const events = require('./events');

const version = '12122017';

module.exports = (providedConfig: ?Object = {}) => {
  const config = mergeDeep(providedConfig || {}, defaultConfig);
  const {winston} = config;
  const {colors, levels} = winston;

  winstonLib.addColors(colors);

  const logger = new winstonLib.Logger(winston);
  logger.setLevels(levels);

  if (
    !config.secrets ||
    !config.secrets.clientId ||
    !config.secrets.clientSecret ||
    !config.secrets.redirectUrl
  ) {
    logger.error(
      `Client configuration not supplied; add config.secrets information,
      (clientId, clientSecret, redirectUrl).`,
    );
    throw new Error('Configuration Error: Client information not supplied.');
  }

  if (!config.foursquare.accessTokenUrl || !config.foursquare.apiUrl) {
    logger.error(
      `Foursquare configuration not supplied; add config.foursquare
      information, (accessTokenUrl, apiUrl)`,
    );
    throw new TypeError(
      'Configuration Error: Foursquare information not supplied.',
    );
  }

  if (!config.foursquare.version) {
    config.foursquare.version = version;
    logger.warn(
      `Foursquare API version not defined in configuration; defaulting to
      latest: ${config.foursquare.version}`,
    );
  }

  if (!config.foursquare.mode) {
    config.foursquare.mode = 'foursquare';
    logger.warn(
      `Foursquare API mode not defined in configuration; defaulting to: ${
        config.foursquare.mode
      }`,
    );
  }

  const core = coreLib(config);
  const {foursquare, secrets} = config;
  const {clientId, clientSecret, redirectUrl} = secrets;
  const {accessTokenUrl, authenticateUrl} = foursquare;

  /**
   * Exchange a user authorization code for an access token.
   * @memberof module:node-foursquare
   */
  function getAccessToken(
    providedParams: ?{
      grant_type?: ?string,
    },
    callback: CallbackFunction = empty,
  ) {
    const params = {
      grant_type:
        (providedParams && providedParams.grant_type) || 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUrl,
    };

    core.retrieve(
      `${accessTokenUrl}?${qs.stringify(params)}`,
      (error, status, result) => {
        if (error) {
          callback(error);
        } else {
          try {
            const resultObj = JSON.parse(result);

            if (resultObj.error) {
              callback(new Error(resultObj.error));
            } else if (!resultObj.access_token) {
              callback(new Error(`access_token not present, got ${result}`));
            } else {
              callback(null, resultObj.access_token);
            }
          } catch (e) {
            callback(e);
          }
        }
      },
    );
  }

  /**
   * Build and return an appropriate Authorization URL where the user can grant
   * permission to the application.
   * @memberof module:node-foursquare
   */
  function getAuthClientRedirectUrl() {
    return `${authenticateUrl}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUrl}`;
  }

  return {
    Users: users(config),
    Venues: venues(config),
    Checkins: checkins(config),
    Tips: tips(config),
    Lists: lists(config),
    Photos: photos(config),
    Settings: settings(config),
    Specials: specials(config),
    Updates: updates(config),
    Events: events(config),
    getAccessToken,
    getAuthClientRedirectUrl,
  };
};
