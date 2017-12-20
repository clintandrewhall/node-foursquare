/* @flow */

import type {FoursquareConfig} from './config-default';
import type {CallbackFunction} from './util/callbacks';
import type {LocationParameter} from './util/locations';

const coreModule = require('./core');
const locations = require('./util/locations');

const emptyCallback = () => {};
const path = require('path');

/**
 * A module for retrieving information about Checkins from Foursquare.
 * @module node-foursquare/Checkins
 */
module.exports = (config: FoursquareConfig) => {
  const core = coreModule(config);
  const logger = core.getLogger('checkins');
  const module = 'Checkins';

  function addPostToCheckin(
    checkinId: string,
    params: ?{
      text?: string,
      url?: URL,
      contentId?: string,
    } = {},
    accessToken: string,
    callback: CallbackFunction,
  ) {
    const method = 'addPostToCheckin';
    logger.enter(method);

    if (!checkinId) {
      logger.error(`${method}: checkinId is required.`);
      callback(new Error(`${module}.${method}: checkinId is required.`));
      return;
    }

    core.postApi(
      path.join('/checkins', checkinId, 'addpost'),
      accessToken,
      params,
      callback,
    );
  }

  function createCheckin(
    venueId: string,
    params: ?{
      broadcast?: Array<'private' | 'public' | 'facebook' | 'twitter' | 'followers'>, // prettier-ignore
      eventId?: string,
      location?: LocationParameter,
      mentions?: Array<string>,
      shout?: string,
    },
    accessToken: string,
    callback: CallbackFunction,
  ) {
    const method = 'createCheckin';
    logger.enter(method);

    if (!venueId) {
      logger.error(`${method}: venueId is required.`);
      callback(new Error(`${module}.${method}: venueId is required.`));
      return;
    }

    const providedParams = params || {};
    const {location, ...otherParams} = providedParams;
    const locationParams = locations.getLocationAPIParameter(
      params,
      method,
      module,
      logger,
      callback,
    );

    core.postApi(
      '/checkins/add',
      accessToken,
      {
        venueId,
        ...locationParams,
        ...otherParams,
      },
      callback,
    );
  }

  function getCheckinDetails(
    checkinId: string,
    params: ?{} = {},
    accessToken: string,
    callback: CallbackFunction,
  ) {
    const method = 'getCheckinDetails';
    logger.enter(method);

    if (!checkinId) {
      logger.error(`${method}: checkinId is required.`);
      callback(new Error(`${module}.${method}: checkinId is required.`));
      return;
    }

    core.callApi(
      path.join('/checkins', checkinId),
      accessToken,
      params,
      callback,
    );
  }

  function getRecentCheckins(
    params: ?{
      afterTimestamp?: number,
      limit?: number,
      location?: LocationParameter,
    } = {},
    accessToken: string,
    callback: CallbackFunction = emptyCallback,
  ) {
    const method = 'getRecentCheckins';
    logger.enter(method);
    const providedParams = params || {};
    const {location, ...otherParams} = providedParams;
    const locationParams = locations.getLocationAPIParameter(
      params,
      method,
      module,
      logger,
      callback,
    );

    core.callApi(
      '/checkins/recent',
      accessToken,
      {
        ...locationParams,
        ...otherParams,
      },
      callback,
    );
  }

  function likeCheckin(
    checkinId: string,
    // eslint-disable-next-line
    params: ?{} = {},
    accessToken: string,
    callback: CallbackFunction,
  ) {
    const method = 'likeCheckin';
    logger.enter(method);

    if (!checkinId) {
      logger.error(`${method}: checkinId is required.`);
      callback(new Error(`${module}.${method}: checkinId is required.`));
      return;
    }

    core.postApi(
      path.join('/checkins', checkinId, 'like'),
      accessToken,
      {set: 1},
      callback,
    );
  }

  function resolveCheckin(
    shortId: string,
    // eslint-disable-next-line
    params: ?{} = {},
    accessToken: string,
    callback: CallbackFunction,
  ) {
    const method = 'likeCheckin';
    logger.enter(method);

    if (!shortId) {
      logger.error(`${method}: shortId is required.`);
      callback(new Error(`${module}.${method}: shortId is required.`));
      return;
    }

    core.postApi('/checkins/resolve', accessToken, {shortId}, callback);
  }

  function unlikeCheckin(
    checkinId: string,
    params: ?{} = {}, // eslint-disable-line
    accessToken: string,
    callback: CallbackFunction,
  ) {
    const method = 'unlikeCheckin';
    logger.enter(method);

    if (!checkinId) {
      logger.error(`${method}: checkinId is required.`);
      callback(new Error(`${module}.${method}: checkinId is required.`));
      return;
    }

    core.postApi(
      path.join('/checkins', checkinId, 'like'),
      accessToken,
      {set: 0},
      callback,
    );
  }

  return {
    addPostToCheckin,
    createCheckin,
    getCheckinDetails,
    getRecentCheckins,
    likeCheckin,
    resolveCheckin,
    unlikeCheckin,
  };
};
