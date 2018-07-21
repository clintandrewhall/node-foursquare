/* @flow */

import path from 'path';

import coreModule from './core';
import locations from './util/locations';

import type { FoursquareConfig } from './config-default';
import type { CallbackFunction } from './util/callbacks';
import type { LocationParameter } from './util/locations';

import { empty } from './util/callbacks';
import defaultConfig from './config-default';
import LogHelper from './util/logHelper';
import mergeDeep from './util/mergeDeep';

/**
 * A module for retrieving information about Checkins from Foursquare.
 * @module node-foursquare/Checkins
 */
export default function(providedConfig: Object | FoursquareConfig = {}) {
  const config = mergeDeep(defaultConfig, providedConfig || {});
  const core = coreModule(config);
  const logger = core.getLogger('checkins');
  const logHelper = new LogHelper('Checkins', logger);

  const add = (
    venueId: string,
    params: ?{
      broadcast?: Array<
        'private' | 'public' | 'facebook' | 'twitter' | 'followers'
      >,
      eventId?: string,
      location?: LocationParameter,
      mentions?: Array<string>,
      shout?: string,
    } = {},
    accessToken: string,
    callback: CallbackFunction = empty
  ) => {
    const method = 'createCheckin';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ venueId }, method, callback)) {
      return;
    }

    const providedParams = params || {};

    // eslint-disable-next-line no-unused-vars
    const { location, ...otherParams } = providedParams;
    const locationParams = locations.getLocationAPIParameter(
      params,
      method,
      'Checkins',
      logger,
      callback
    );

    logHelper.debugParams({ ...locationParams, ...otherParams }, method);

    core.postApi(
      '/checkins/add',
      accessToken,
      {
        venueId,
        ...locationParams,
        ...otherParams,
      },
      callback
    );
  };

  const addPost = (
    checkinId: string,
    params: ?{
      text?: string,
      url?: string,
      contentId?: string,
    } = {},
    accessToken: string,
    callback: CallbackFunction = empty
  ) => {
    const method = 'addPost';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ checkinId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.postApi(
      path.join('/checkins', checkinId, 'addpost'),
      accessToken,
      params,
      callback
    );
  };

  const getDetails = (
    checkinId: string,
    params: ?{} = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'getDetails';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ checkinId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.callApi(
      path.join('/checkins', checkinId),
      accessToken,
      params,
      callback
    );
  };

  const like = (
    checkinId: string,
    params: ?{} = {},
    accessToken: string,
    callback: CallbackFunction = empty
  ) => {
    const method = 'like';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ checkinId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.postApi(
      path.join('/checkins', checkinId, 'like'),
      accessToken,
      { set: 1 },
      callback
    );
  };

  const resolve = (
    shortId: string,
    params: ?{} = {},
    accessToken: string,
    callback: CallbackFunction
  ) => {
    const method = 'resolve';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ shortId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.callApi('/checkins/resolve', accessToken, { shortId }, callback);
  };

  const unlike = (
    checkinId: string,
    params: ?{} = {},
    accessToken: string,
    callback: CallbackFunction = empty
  ) => {
    const method = 'unlike';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ checkinId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.postApi(
      path.join('/checkins', checkinId, 'like'),
      accessToken,
      { set: 0 },
      callback
    );
  };

  return {
    add,
    addPost,
    getDetails,
    like,
    resolve,
    unlike,
  };
}
