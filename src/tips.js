/* @flow */
import path from 'path';

import coreModule from './core';

import type { FoursquareConfig } from './config-default';
import type { CallbackFunction } from './util/callbacks';

import { empty } from './util/callbacks';
import LogHelper from './util/logHelper';
import defaultConfig from './config-default';
import mergeDeep from './util/mergeDeep';

/**
 * A module for retrieving information about Tips from Foursquare.
 * @module node-foursquare/Tips
 */
export default function(providedConfig: Object | FoursquareConfig = {}) {
  const config = mergeDeep(defaultConfig, providedConfig || {});
  const core = coreModule(config);
  const logger = core.getLogger('tips');
  const logHelper = new LogHelper('Tips', logger);

  /**
   * Retrieve a Tip.
   */
  const getDetails = (
    tipId: string,
    accessToken: string,
    callback: CallbackFunction
  ) => {
    const method = 'getDetails';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ tipId }, method, callback)) {
      return;
    }

    core.callApi(path.join('/tips', tipId), accessToken, null, callback);
  };

  /**
   * Add a tip to a venue.
   */
  const add = (
    venueId: string,
    text: string,
    params: ?{
      url?: string,
      broadcast?: 'facebook' | 'twitter' | 'facebook,twitter',
    } = {},
    accessToken: string,
    callback: CallbackFunction = empty
  ) => {
    const method = 'add';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ venueId, text }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.postApi('/tips/add', accessToken, params, callback);
  };

  return {
    add,
    getDetails,
  };
}
