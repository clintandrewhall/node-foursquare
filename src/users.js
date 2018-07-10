/* @flow */
import path from 'path';

import coreModule from './core';
import locations from './util/locations';

import type { FoursquareConfig } from './config-default';
import type { CallbackFunction } from './util/callbacks';
import type { LocationParameter } from './util/locations';

import LogHelper from './util/logHelper';
import defaultConfig from './config-default';
import mergeDeep from './util/mergeDeep';

/**
 * A module for retrieving information about Users from Foursquare.
 * @module node-foursquare/Users
 */
export default function(providedConfig: Object | FoursquareConfig = {}) {
  const config = mergeDeep(defaultConfig, providedConfig || {});
  const core = coreModule(config);
  const logger = core.getLogger('users');
  const logHelper = new LogHelper('Users', logger);

  /**
   * Find Foursquare Users.
   */
  const search = (
    params: ?{
      phone?: string,
      email?: string,
      twitter?: string,
      twitterSource?: string,
      fbid?: string,
      name?: string,
      onlyPages?: boolean,
    } = {},
    accessToken: string,
    callback: CallbackFunction
  ) => {
    const method = 'search';
    logger.enter(method);
    logHelper.debugParams(params, method);
    core.callApi('/users/search', accessToken, params, callback);
  };

  /**
   * Retrieve a Foursquare User.
   */
  const getDetails = (
    userId: string,
    accessToken: string,
    callback: CallbackFunction
  ) => {
    const method = 'getDetails';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ userId }, method, callback)) {
      return;
    }

    core.callApi('/users/' + userId, accessToken, null, callback);
  };

  /**
   * Retrieve the current Foursquare User.
   */
  const getSelfDetails = (accessToken: string, callback: CallbackFunction) => {
    return getDetails('self', accessToken, callback);
  };

  /**
   * Retrieve Check-ins for the current Foursquare User.
   */
  const getSelfCheckins = (
    params: ?{
      limit?: number,
      offset?: number,
      sort?: 'newestfirst' | 'oldestfirst',
      afterTimestamp?: number,
      beforeTimestamp?: number,
    } = {},
    accessToken: string,
    callback: CallbackFunction
  ) => {
    const method = 'getSelfCheckins';
    logger.enter(method);
    logHelper.debugParams(params, method);
    core.callApi('/users/self/checkins', accessToken, params, callback);
  };

  /**
   * Retrieve Friends for a Foursquare User.
   */
  const getFriends = (
    userId: string,
    params: ?{
      limit?: number,
      offset?: number,
    } = {},
    accessToken: string,
    callback: CallbackFunction
  ) => {
    const method = 'getFriends';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ userId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.callApi(
      path.join('/users', userId, 'friends'),
      accessToken,
      params,
      callback
    );
  };

  /**
   * Retrieve Friends for a Foursquare User.
   */
  const getSelfFriends = (
    params: ?{
      limit?: number,
      offset?: number,
    } = {},
    accessToken: string,
    callback: CallbackFunction
  ) => {
    return getFriends('self', params, accessToken, callback);
  };

  /**
   * Retrieve Lists for a Foursquare User.
   */
  const getLists = (
    userId: string,
    params: ?{
      group?: 'created' | 'edited | followed | friends | suggested',
      location?: LocationParameter,
      limit?: number,
      offset?: number,
    } = {},
    accessToken: string,
    callback: CallbackFunction
  ) => {
    const method = 'getLists';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ userId }, method, callback)) {
      return;
    }

    params = params || {};

    // eslint-disable-next-line no-unused-vars
    const { location, ...otherParams } = params;
    const locationParams = locations.getLocationAPIParameter(
      params,
      method,
      'Lists',
      logger,
      callback
    );

    logHelper.debugParams({ ...locationParams, ...otherParams }, method);

    core.callApi(
      path.join('/users', userId, 'lists'),
      accessToken,
      { ...locationParams, ...otherParams },
      callback
    );
  };

  /**
   * Retrieve Lists for the current Foursquare User.
   */
  const getSelfLists = (
    params: ?{
      group?: 'created' | 'edited | followed | friends | suggested',
      location?: LocationParameter,
      limit?: number,
      offset?: number,
    } = {},
    accessToken: string,
    callback: CallbackFunction
  ) => {
    return getLists('self', params, accessToken, callback);
  };

  /**
   * Retrieve Photos for a Foursquare User.
   */
  const getPhotos = (
    userId: string,
    params: ?{ limit?: number, offset?: number } = {},
    accessToken: string,
    callback: CallbackFunction
  ) => {
    const method = 'getPhotos';

    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ userId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.callApi(
      path.join('/users', userId, 'photos'),
      accessToken,
      params,
      callback
    );
  };

  /**
   * Retrieve Photos for the current Foursquare User.
   */
  const getSelfPhotos = (
    params: ?{ limit?: number, offset?: number } = {},
    accessToken: string,
    callback: CallbackFunction
  ) => {
    return getPhotos('self', params, accessToken, callback);
  };

  /**
   * Retrieve Venues visited by the current Foursquare User.
   */
  function getSelfVenueHistory(
    params: ?{
      beforeTimestamp?: number,
      afterTimestamp?: number,
      categoryId?: string,
    } = {},
    accessToken: string,
    callback: CallbackFunction
  ) {
    const method = 'getSelfVenueHistory';
    logger.enter(method);
    logHelper.debugParams(params, method);

    core.callApi('/users/self/venuehistory', accessToken, params, callback);
  }

  /**
   * Retrieve Venues liked by a Foursquare User.
   */
  const getVenueLikes = (
    userId: string,
    params: ?{
      beforeTimestamp?: number,
      afterTimestamp?: number,
      categoryId?: string,
      limit?: number,
      offset?: number,
    } = {},
    accessToken: string,
    callback: CallbackFunction
  ) => {
    const method = 'getVenueLikes';

    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ userId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.callApi(
      path.join('/users', userId, 'venuelikes'),
      accessToken,
      params,
      callback
    );
  };

  /**
   * Retrieve Venues liked by the current Foursquare User.
   */
  const getSelfVenueLikes = (
    params: ?{
      beforeTimestamp?: number,
      afterTimestamp?: number,
      categoryId?: string,
      limit?: number,
      offset?: number,
    } = {},
    accessToken: string,
    callback: CallbackFunction
  ) => {
    return getVenueLikes('self', params, accessToken, callback);
  };

  /**
   * Retrieve Venues liked by a Foursquare User.
   */
  const getTastes = (
    userId: string,
    params: ?{} = {},
    accessToken: string,
    callback: CallbackFunction
  ) => {
    const method = 'getTastes';

    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ userId }, method, callback)) {
      return;
    }

    core.callApi(
      path.join('/users', userId, 'tastes'),
      accessToken,
      params,
      callback
    );
  };

  /**
   * Retrieve Venues liked by the current Foursquare User.
   */
  const getSelfTastes = (
    params: ?{} = {},
    accessToken: string,
    callback: CallbackFunction
  ) => {
    return getTastes('self', params, accessToken, callback);
  };

  return {
    getDetails,
    getFriends,
    getLists,
    getPhotos,
    getSelfCheckins,
    getSelfDetails,
    getSelfFriends,
    getSelfLists,
    getSelfPhotos,
    getSelfTastes,
    getSelfVenueHistory,
    getSelfVenueLikes,
    getTastes,
    getVenueLikes,
    search,
  };
}
