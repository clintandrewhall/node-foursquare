/* @flow */

/**
 * A NodeJS module for interfacing with Foursquare.
 * @module node-foursquare
 * @author Clint Andrew Hall
 * @description A NodeJS module for interacting with Foursquare.
 */
import type { FoursquareConfig } from './config-default';
import type { CallbackFunction } from './util/callbacks';

import _ from 'babel-polyfill';

import qs from 'querystring';
import fetch from 'node-fetch';

import { empty } from './util/callbacks';
import coreLib from './core';
import defaultConfig from './config-default';
import mergeDeep from './util/mergeDeep';

import checkins from './checkins';
import lists from './lists';
import photos from './photos';
import tips from './tips';
import users from './users';
import venues from './venues';

const version = '07102018';

export default (providedConfig: Object | FoursquareConfig = {}) => {
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

  const { foursquare, secrets } = config;
  const { clientId, clientSecret, redirectUrl } = secrets;
  const { accessTokenUrl, authenticateUrl } = foursquare;

  /**
   * Exchange a user authorization code for an access token.
   * @memberof module:node-foursquare
   */
  async function getAccessToken(
    providedParams: {
      code: string,
      grant_type?: ?string,
    },
    callback: CallbackFunction = empty
  ): Promise<void> {
    const { code } = providedParams;
    const params = {
      code,
      grant_type: providedParams.grant_type || 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUrl,
    };

    const response = await fetch(`${accessTokenUrl}?${qs.stringify(params)}`);
    const { ok } = response;
    const result = await response.json();

    if (ok) {
      const { access_token } = result;
      if (access_token) {
        callback(null, result.access_token);
        return;
      }
      callback(new Error(`access_token not present, got ${result}`));
      return;
    }

    callback(new Error(result.error));
  }

  /**
   * Build and return an appropriate Authorization URL where the user can grant
   * permission to the application.
   */
  function getAuthClientRedirectUrl(): string {
    return `${authenticateUrl}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUrl}`;
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
