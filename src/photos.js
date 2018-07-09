/* @flow */
import path from 'path';

import coreLib from './core';
import LogHelper from './util/logHelper';

import type { FoursquareConfig } from './config-default';
import type { CallbackFunction } from './util/callbacks';

/**
 * A module for retrieving information about Photos from Foursquare.
 * @module node-foursquare/Photos
 */
module.exports = function(
  config: FoursquareConfig
): {
  get: Function,
} {
  const core = coreLib(config);
  const logger = core.getLogger('photos');
  const logHelper = new LogHelper('Photos', logger);

  /**
   * Retrieve a photo from Foursquare.
   */
  const get = (
    photoId: string,
    params: ?{} = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'get';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ photoId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.callApi(path.join('/photos', photoId), accessToken, null, callback);
  };

  return {
    get,
  };
};
