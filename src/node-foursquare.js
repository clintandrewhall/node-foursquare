/* @flow */

/**
 * A NodeJS module for interfacing with Foursquare.
 * @module node-foursquare
 * @author Clint Andrew Hall
 * @description A NodeJS module for interacting with Foursquare.
 */
import type { CallbackFunction } from './util/callbacks';

import qs from 'querystring';

import defaultConfig from './config-default';
import mergeDeep from './util/mergeDeep';
import coreLib from './core';
import { empty } from './util/callbacks';

import users from './users';
import venues from './venues';
import checkins from './checkins';
import tips from './tips';
import lists from './lists';
import photos from './photos';

const version = '12122017';

module.exports = (providedConfig: ?Object = {}) => {
  const config = mergeDeep(defaultConfig, providedConfig || {});
  const core = coreLib(config);
  const logger = core.getLogger('all');

  if (
    !config.secrets ||
    !config.secrets.clientId ||
    !config.secrets.clientSecret ||
    !config.secrets.redirectUrl
  ) {
    logger.error(
      `Client configuration not supplied; add config.secrets information,
      (clientId, clientSecret, redirectUrl).`
    );
    throw new Error('Configuration Error: Client information not supplied.');
  }

  if (!config.foursquare.accessTokenUrl || !config.foursquare.apiUrl) {
    logger.error(
      `Foursquare configuration not supplied; add config.foursquare
      information, (accessTokenUrl, apiUrl)`
    );
    throw new TypeError(
      'Configuration Error: Foursquare information not supplied.'
    );
  }

  if (!config.foursquare.version) {
    config.foursquare.version = version;
    logger.warn(
      `Foursquare API version not defined in configuration; defaulting to
      latest: ${config.foursquare.version}`
    );
  }

  if (!config.foursquare.mode) {
    config.foursquare.mode = 'foursquare';
    logger.warn(
      `Foursquare API mode not defined in configuration; defaulting to: ${
        config.foursquare.mode
      }`
    );
  }

  const { foursquare, secrets } = config;
  const { clientId, clientSecret, redirectUrl } = secrets;
  const { accessTokenUrl, authenticateUrl } = foursquare;

  /**
   * Exchange a user authorization code for an access token.
   * @memberof module:node-foursquare
   */
  function getAccessToken(
    providedParams: {
      code: string,
      grant_type?: ?string,
    },
    callback: CallbackFunction = empty
  ): void {
    const { code } = providedParams;
    const params = {
      code,
      grant_type: providedParams.grant_type || 'authorization_code',
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
      }
    );
  }

  /**
   * Build and return an appropriate Authorization URL where the user can grant
   * permission to the application.
   * @memberof module:node-foursquare
   */
  function getAuthClientRedirectUrl(): string {
    return `${authenticateUrl}?client_id=${clientId}&response_type=code
      &redirect_uri=${redirectUrl}`;
  }

  return {
    Users: users(config),
    Venues: venues(config),
    Checkins: checkins(config),
    Tips: tips(config),
    Lists: lists(config),
    Photos: photos(config),
    getAccessToken,
    getAuthClientRedirectUrl,
  };
};
