/* @flow */
import path from 'path';

import coreModule from './core';
import locations from './util/locations';

import type { FoursquareConfig } from './config-default';
import type { CallbackFunction } from './util/callbacks';
import type { LatLngParameter, LocationParameter } from './util/locations';

import { empty } from './util/callbacks';
import LogHelper from './util/logHelper';
import defaultConfig from './config-default';
import mergeDeep from './util/mergeDeep';

type SearchParams = {
  limit?: number,
  linkedId?: string,
  providerId?: string,
  url?: string,
};

type CategorizedSearchParams = SearchParams & {
  categoryIds?: Array<string>,
};

type AllSearchParams = CategorizedSearchParams & {
  query?: string,
  radius?: number,
};

type ExploreParams = {
  day?: 'any',
  friendVisits?: 'visited' | 'notVisited',
  lastVenue?: string,
  limit?: number,
  novelty?: 'new' | 'old',
  offset?: number,
  openNow?: boolean,
  price?: Array<'1' | '2' | '3' | '4'>,
  query?: string,
  radius?: number,
  saved?: boolean,
  section?:
    | 'arts'
    | 'coffee'
    | 'drinks'
    | 'food'
    | 'nextVenues'
    | 'outdoors'
    | 'shops'
    | 'sights'
    | 'topPicks'
    | 'trending',
  sortByDistance?: boolean,
  time?: 'any',
};

/**
 * A module for retrieving information about Venues from Foursquare.
 * @module node-foursquare/Venues
 */
export default function(providedConfig: Object | FoursquareConfig = {}) {
  const config = mergeDeep(defaultConfig, providedConfig || {});
  const core = coreModule(config);
  const logger = core.getLogger('venues');
  const logHelper = new LogHelper('Checkins', logger);

  const getSimpleEndpoint = (
    venueId: string,
    method: string,
    endpoint: string,
    params: any = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    if (!logHelper.debugAndCheckParams({ venueId }, method, callback)) {
      return;
    }

    core.callApi(
      path.join('/venues', venueId, endpoint),
      accessToken,
      {},
      callback
    );
  };

  /**
   * Retrieve a list of Venue Categories.
   */
  const getCategories = (
    params: ?{} = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'getCategories';
    logger.enter(method);
    logHelper.debugParams(params, method);
    core.callApi('/venues/categories', accessToken, params, callback);
  };

  /**
   * Search Foursquare Venues.
   */
  function searchLocation(
    location: LocationParameter,
    params: ?AllSearchParams & any = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) {
    const method = 'searchLocation';
    logger.enter(method);

    params = params || {};

    const { categoryIds, query, radius, ...otherParams } = params;

    const locationParam = locations.getLocationAPIParameter(
      { location },
      method,
      'Venues',
      logger,
      callback
    );

    if (!locationParam) {
      return;
    }

    if (radius && !(categoryIds || query)) {
      this.logger.error(`Venues: when using radius, either categoryIds or query
        is required.`);
      callback(
        new Error(`Venues.${method}: when using radius, either categoryIds or
          query is required.`)
      );
    }

    let sentParams = {};

    if (categoryIds) {
      sentParams.categoryId = categoryIds.join(',');
    }

    if (radius) {
      sentParams.radius = radius;
    }

    if (query) {
      sentParams.query = query;
    }

    core.callApi(
      '/venues/search',
      accessToken,
      {
        ...sentParams,
        ...locationParam,
        ...otherParams,
      },
      callback
    );
  }

  const searchNear = (
    place: string,
    params: ?AllSearchParams = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'searchNear';
    logger.enter(method);

    params = params || {};

    const { categoryIds, query, radius, ...otherParams } = params;

    if (radius && !(categoryIds || query)) {
      logger.error(`Venues: when using radius, either categoryIds or query
        is required.`);
      callback(
        new Error(`Venues.${method}: when using radius, either categoryIds or
          query is required.`)
      );
    }

    let sentParams = {};

    if (categoryIds) {
      sentParams.categoryId = categoryIds.join(',');
    }

    if (radius) {
      sentParams.radius = radius;
    }

    if (query) {
      sentParams.query = query;
    }

    core.callApi(
      '/venues/search',
      accessToken,
      {
        near: place,
        ...sentParams,
        ...otherParams,
      },
      callback
    );
  };

  const globalSearch = (
    query: string,
    params: ?CategorizedSearchParams = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'globalSearch';
    logger.enter(method);

    logHelper.debugParams({ query, ...params }, method);

    core.callApi(
      '/venues/search',
      accessToken,
      { intent: 'global', query, ...params },
      callback
    );
  };

  const browseBox = (
    northEast: LatLngParameter,
    southWest: LatLngParameter,
    params: ?CategorizedSearchParams = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'browseBox';
    logger.enter(method);

    logHelper.debugParams({ northEast, southWest, ...params }, method);

    const passedParams = {
      ne: northEast.lat + ',' + northEast.long,
      sw: southWest.lat + ',' + southWest.long,
      ...params,
    };

    core.callApi(
      '/venues/search',
      accessToken,
      { intent: 'browse', ...passedParams },
      callback
    );
  };

  const browseCircle = (
    location: LocationParameter,
    radius: number,
    params: ?CategorizedSearchParams = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'browseCircle';
    logger.enter(method);

    const locationParam = locations.getLocationAPIParameter(
      { location },
      method,
      'Venues',
      logger,
      callback
    );

    if (!locationParam) {
      return;
    }

    logHelper.debugParams({ locationParam, radius, ...params }, method);

    core.callApi(
      '/venues/search',
      accessToken,
      { intent: 'browse', radius, ...locationParam, ...params },
      callback
    );
  };

  const match = (
    location: LocationParameter,
    query: string,
    params: ?SearchParams = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'match';
    logger.enter(method);

    logHelper.debugParams({ location, query, ...params }, method);

    const locationParam = locations.getLocationAPIParameter(
      { location },
      method,
      'Venues',
      logger,
      callback
    );

    if (!locationParam) {
      return;
    }

    core.callApi(
      '/venues/search',
      accessToken,
      { intent: 'match', query, ...locationParam, ...params },
      callback
    );
  };

  /**
   * Explore Foursquare Venues near a location.
   */
  const exploreLocation = (
    location: LocationParameter,
    radius: number,
    params: ?ExploreParams = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'exploreLocation';
    logger.enter(method);

    const locationParam = locations.getLocationAPIParameter(
      { location },
      method,
      'Venues',
      logger,
      callback
    );

    if (!locationParam) {
      return;
    }

    const { openNow, sortByDistance, price, saved, ...otherParams } =
      params || {};

    let sentParams: { [string]: any } = { ...otherParams };

    if (openNow) {
      sentParams.openNow = '1';
    }

    if (sortByDistance) {
      sentParams.sortByDistance = '1';
    }

    if (saved) {
      sentParams.saved = '1';
    }

    if (price) {
      sentParams.price = price.join(',');
    }

    logHelper.debugParams({ location, ...sentParams }, method);

    core.callApi(
      '/venues/explore',
      accessToken,
      { ...locationParam, ...sentParams },
      callback
    );
  };

  /**
   * Explore Foursquare Venues near a named place, (e.g. Chicago, IL).
   */
  const exploreNear = (
    place: string,
    params: ?ExploreParams = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'exploreNear';
    logger.enter(method);

    const { openNow, sortByDistance, price, saved, ...otherParams } =
      params || {};

    let sentParams: { [string]: any } = { ...otherParams };

    if (openNow) {
      sentParams.openNow = '1';
    }

    if (sortByDistance) {
      sentParams.sortByDistance = '1';
    }

    if (saved) {
      sentParams.saved = '1';
    }

    if (price) {
      sentParams.price = price.join(',');
    }

    logHelper.debugParams({ place, ...sentParams }, method);

    core.callApi(
      '/venues/explore',
      accessToken,
      { near: place, ...sentParams },
      callback
    );
  };

  /**
   * Retrieve Photos for a Foursquare Venue.
   */
  const getPhotos = (
    venueId: string,
    params: ?{
      group?: 'checkin' | 'venue',
      limit?: number,
      offset?: number,
    } = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'getPhotos';
    logger.enter(method);
    return getSimpleEndpoint(
      venueId,
      method,
      'photos',
      params,
      accessToken,
      callback
    );
  };

  /**
   * Retrieve Details for a Foursquare Venue.
   */
  const getDetails = (
    venueId: string,
    params: ?{} = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'getDetails';
    logger.enter(method);
    return getSimpleEndpoint(
      venueId,
      method,
      '',
      params,
      accessToken,
      callback
    );
  };

  /**
   * Retrieve Tips for a Foursquare Venue.
   */
  const getTips = (
    venueId: string,
    params: ?{
      sort?: 'friends' | 'recent' | 'popular',
      limit?: number,
      offset?: number,
    } = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'getTips';
    logger.enter(method);
    return getSimpleEndpoint(
      venueId,
      method,
      'tips',
      params,
      accessToken,
      callback
    );
  };

  /**
   * Retrieve hours for a Foursquare Venue.
   */
  const getHours = (
    venueId: string,
    params: ?{} = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'getHours';
    logger.enter(method);
    return getSimpleEndpoint(
      venueId,
      method,
      'hours',
      params,
      accessToken,
      callback
    );
  };

  /**
   * Retrieve the menu for a Foursquare Venue.
   */
  const getMenu = (
    venueId: string,
    params: ?{} = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'getMenu';
    logger.enter(method);
    return getSimpleEndpoint(
      venueId,
      method,
      'menu',
      params,
      accessToken,
      callback
    );
  };

  /**
   * Retrieve the links associated with a Foursquare Venue.
   */
  const getLinks = (
    venueId: string,
    params: ?{} = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'getLinks';
    logger.enter(method);
    return getSimpleEndpoint(
      venueId,
      method,
      'links',
      params,
      accessToken,
      callback
    );
  };

  /**
   * Get Trending Venues at a location
   */
  function getLocationTrending(
    location: LocationParameter,
    params: ?{
      limit?: number,
      radius?: number,
    } = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) {
    const method = 'getLocationTrending';
    logger.enter(method);

    const locationParam = locations.getLocationAPIParameter(
      { location },
      method,
      'Venues',
      logger,
      callback
    );

    if (!locationParam) {
      return;
    }

    logHelper.debugParams(params, method);

    core.callApi(
      '/venues/trending',
      accessToken,
      {
        ...locationParam,
        ...params,
      },
      callback
    );
  }

  const getNearTrending = (
    place: string,
    params: ?{
      limit?: number,
      radius?: number,
    } = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'getNearTrending';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ place }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.callApi(
      '/venues/search',
      accessToken,
      {
        near: place,
        ...params,
      },
      callback
    );
  };

  /**
   * Get a list of mini-venues partially matching the search term, near a
   * location.
   */
  function getLocationSuggestCompletion(
    location: LocationParameter,
    query: string,
    params: ?{
      limit?: number,
      radius?: number,
    } = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) {
    const method = 'getLocationSuggestCompletion';
    logger.enter(method);

    const locationParam = locations.getLocationAPIParameter(
      { location },
      method,
      'Venues',
      logger,
      callback
    );

    if (!locationParam) {
      return;
    }

    logHelper.debugParams({ query, ...params }, method);

    core.callApi(
      '/venues/suggestcompletion',
      accessToken,
      {
        query,
        ...locationParam,
        ...params,
      },
      callback
    );
  }

  const getNearSuggestCompletion = (
    place: string,
    query: string,
    params: ?{
      limit?: number,
      radius?: number,
    } = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'getNearSuggestCompletion';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ place }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.callApi(
      '/venues/search',
      accessToken,
      {
        near: place,
        ...params,
      },
      callback
    );
  };

  const getBoxedSuggestCompletion = (
    northEast: LatLngParameter,
    southWest: LatLngParameter,
    query: string,
    params: ?{
      limit?: number,
    } = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'getBoxedSuggestCompletion';
    logger.enter(method);

    logHelper.debugParams({ northEast, southWest, ...params }, method);

    const passedParams = {
      ne: northEast.lat + ',' + northEast.long,
      sw: southWest.lat + ',' + southWest.long,
      ...params,
    };

    core.callApi(
      '/venues/suggestcompletion',
      accessToken,
      { intent: 'browse', query, ...passedParams },
      callback
    );
  };

  /**
   * Retrieve the likes associated with a Foursquare Venue.
   */
  const getLikes = (
    venueId: string,
    params: ?{} = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'getLikes';
    logger.enter(method);
    return getSimpleEndpoint(
      venueId,
      method,
      'likes',
      params,
      accessToken,
      callback
    );
  };

  /**
   * Retrieve venues similar to a Foursquare Venue.
   */
  const getSimilar = (
    venueId: string,
    params: ?{} = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'getSimilar';
    logger.enter(method);
    return getSimpleEndpoint(
      venueId,
      method,
      'similar',
      params,
      accessToken,
      callback
    );
  };

  /**
   * Retrieve events at a Foursquare Venue.
   */
  const getEvents = (
    venueId: string,
    params: ?{} = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'getEvents';
    logger.enter(method);
    return getSimpleEndpoint(
      venueId,
      method,
      'events',
      params,
      accessToken,
      callback
    );
  };

  /**
   * Retrieve venues commonly followed by a Foursquare Venue.
   */
  const getNextVenues = (
    venueId: string,
    params: ?{} = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'getNextVenues';
    logger.enter(method);
    return getSimpleEndpoint(
      venueId,
      method,
      'nextvenues',
      params,
      accessToken,
      callback
    );
  };

  /**
   * Retrieve lists where a Foursquare Venue appears.
   */
  const getListed = (
    venueId: string,
    params: ?{
      group?: 'created' | 'edited' | 'followed' | 'friends' | 'other',
      limit?: number,
      offset?: number,
    } = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'getListed';
    logger.enter(method);
    return getSimpleEndpoint(
      venueId,
      method,
      'listed',
      params,
      accessToken,
      callback
    );
  };

  /**
   * Retrieve daily venue stats for a list of venues over a time range.
   */
  const getTimeSeriesStats = (
    venueIds: Array<string>,
    startAt: number,
    params: ?{
      endAt?: number,
      fields?: Array<
        | 'totalCheckins'
        | 'newCheckins'
        | 'uniqueVisitors'
        | 'sharing'
        | 'genders'
        | 'ages'
        | 'hours'
      >,
    } = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'getTimeSeriesStats';
    logger.enter(method);

    if (
      !logHelper.debugAndCheckParams({ venueIds, startAt }, method, callback)
    ) {
      return;
    }
    logHelper.debugParams(params, method);
    let { fields, ...otherParams } = params || {};
    fields = fields || [];
    core.callApi(
      '/venues/timeseries',
      accessToken,
      {
        venueId: venueIds.join(','),
        fields: fields.join(','),
        startAt,
        ...otherParams,
      },
      callback
    );
  };

  const getStats = (
    venueId: string,
    params: ?{
      startAt?: number,
      endAt?: number,
    } = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'getStats';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ venueId }, method, callback)) {
      return;
    }
    logHelper.debugParams(params, method);
    core.callApi(
      path.join('/venues', venueId, 'stats'),
      accessToken,
      params,
      callback
    );
  };

  /**
   * Retrieve a list of venues the current user manages.
   */
  const getManagedVenues = (
    params: ?{
      limit?: number,
      offset?: number,
    } = {},
    accessToken: ?string,
    callback: CallbackFunction
  ) => {
    const method = 'getManagedVenues';
    logger.enter(method);
    logHelper.debugParams(params, method);
    core.callApi('/venues/managed', accessToken, params, callback);
  };

  const like = (
    venueId: string,
    params: ?{} = {},
    accessToken: ?string,
    callback: CallbackFunction = empty
  ) => {
    const method = 'like';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ venueId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.postApi(
      path.join('/venues', venueId, 'like'),
      accessToken,
      { set: 1 },
      callback
    );
  };

  const unlike = (
    venueId: string,
    params: ?{} = {},
    accessToken: ?string,
    callback: CallbackFunction = empty
  ) => {
    const method = 'unlike';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ venueId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.postApi(
      path.join('/venues', venueId, 'like'),
      accessToken,
      { set: 0 },
      callback
    );
  };

  return {
    browseBox,
    browseCircle,
    exploreLocation,
    exploreNear,
    getBoxedSuggestCompletion,
    getCategories,
    getDetails,
    getEvents,
    getHours,
    getLikes,
    getLinks,
    getListed,
    getLocationSuggestCompletion,
    getLocationTrending,
    getManagedVenues,
    getMenu,
    getNearSuggestCompletion,
    getNearTrending,
    getNextVenues,
    getPhotos,
    getSimilar,
    getStats,
    getTimeSeriesStats,
    getTips,
    globalSearch,
    like,
    match,
    searchLocation,
    searchNear,
    unlike,
  };
}
