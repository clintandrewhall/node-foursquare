/* @flow */
import path from 'path';

import coreLib from './core';

import type { FoursquareConfig } from './config-default';
import type { CallbackFunction } from './util/callbacks';

import { empty } from './util/callbacks';
import LogHelper from './util/logHelper';
import defaultConfig from './config-default';
import mergeDeep from './util/mergeDeep';

/**
 * A module for retrieving information about Lists from Foursquare.
 * @module node-foursquare/Lists
 */
export default function(providedConfig: Object | FoursquareConfig = {}) {
  const config = mergeDeep(defaultConfig, providedConfig || {});
  const core = coreLib(config);
  const logger = core.getLogger('lists');
  const logHelper = new LogHelper('Lists', logger);

  /**
   * Retrieve a list from Foursquare.
   */
  function getByID(
    listId: string,
    accessToken: string,
    callback: CallbackFunction
  ) {
    const method = 'get';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ listId }, method, callback)) {
      return;
    }

    core.callApi(path.join('/lists', listId), accessToken, null, callback);
  }

  /**
   * Retrieve a list from Foursquare using a list name and either the creator's
   * name or user ID.
   */
  function getByName(
    userNameOrId: string,
    listName: string,
    accessToken: string,
    callback: CallbackFunction
  ) {
    const method = 'getByName';

    if (
      !logHelper.debugAndCheckParams(
        { userNameOrId, listName },
        method,
        callback
      )
    ) {
      return;
    }

    core.callApi(
      path.join('/lists', userNameOrId, listName),
      accessToken,
      null,
      callback
    );
  }

  /**
   * Create a list
   */
  function create(
    name: string,
    params?: {
      description?: string,
      collaborative?: boolean,
      photoId?: string,
    } = {},
    accessToken: string,
    callback: CallbackFunction = empty
  ) {
    const method = 'create';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ name }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.postApi(
      '/lists/add',
      accessToken,
      {
        name,
        ...params,
      },
      callback
    );
  }

  /**
   * Add an item to a list by venue.
   */
  function addItemByVenue(
    listId: string,
    venueId: string,
    params?: {
      url?: string,
    } = {},
    accessToken: string,
    callback: CallbackFunction = empty
  ) {
    const method = 'addItemByVenue';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ listId, venueId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.postApi(
      path.join('/lists', listId, 'additem'),
      accessToken,
      {
        venueId,
        ...params,
      },
      callback
    );
  }

  /**
   * Add an item to a list by tip.
   */
  function addItemByTip(
    listId: string,
    tipId: string,
    params?: {
      url?: string,
    } = {},
    accessToken: string,
    callback: CallbackFunction = empty
  ) {
    const method = 'addItemByTip';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ listId, tipId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.postApi(
      path.join('/lists', listId, 'additem'),
      accessToken,
      {
        tipId,
        ...params,
      },
      callback
    );
  }

  /**
   * Add an item to a list.
   */
  function addItem(
    listId: string,
    itemId: string,
    params?: {
      url?: string,
    } = {},
    accessToken: string,
    callback: CallbackFunction = empty
  ) {
    const method = 'addItem';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ listId, itemId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.postApi(
      path.join('/lists', listId, 'additem'),
      accessToken,
      {
        itemId,
        ...params,
      },
      callback
    );
  }

  /**
   * Add an item to a list.
   */
  function shareList(
    listId: string,
    broadcast: 'facebook' | 'twitter' | 'facebook,twitter',
    params?: {
      message?: string,
    } = {},
    accessToken: string,
    callback: CallbackFunction = empty
  ) {
    const method = 'shareList';
    logger.enter(method);

    if (
      !logHelper.debugAndCheckParams({ listId, broadcast }, method, callback)
    ) {
      return;
    }

    logHelper.debugParams(params, method);

    core.postApi(
      path.join('/lists', listId, 'additem'),
      accessToken,
      {
        broadcast,
        ...params,
      },
      callback
    );
  }

  return {
    addItem,
    addItemByTip,
    addItemByVenue,
    create,
    getByID,
    getByName,
    shareList,
  };
}
