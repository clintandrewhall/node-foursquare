'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
  var providedConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var config = (0, _mergeDeep2.default)(_configDefault2.default, providedConfig || {});
  var core = (0, _core2.default)(config);
  var logger = core.getLogger('venues');
  var logHelper = new _logHelper2.default('Checkins', logger);

  var getSimpleEndpoint = function getSimpleEndpoint(venueId, method, endpoint) {
    var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var accessToken = arguments[4];
    var callback = arguments[5];

    if (!logHelper.debugAndCheckParams({ venueId }, method, callback)) {
      return;
    }

    core.callApi(_path2.default.join('/venues', venueId, endpoint), accessToken, {}, callback);
  };

  var getCategories = function getCategories() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var accessToken = arguments[1];
    var callback = arguments[2];

    var method = 'getCategories';
    logger.enter(method);
    logHelper.debugParams(params, method);
    core.callApi('/venues/categories', accessToken, params, callback);
  };

  function searchLocation(location) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments[3];

    var method = 'searchLocation';
    logger.enter(method);

    params = params || {};

    var _params = params,
        categoryIds = _params.categoryIds,
        query = _params.query,
        radius = _params.radius,
        otherParams = _objectWithoutProperties(_params, ['categoryIds', 'query', 'radius']);

    var locationParam = _locations2.default.getLocationAPIParameter({ location }, method, 'Venues', logger, callback);

    if (!locationParam) {
      return;
    }

    if (radius && !(categoryIds || query)) {
      this.logger.error(`Venues: when using radius, either categoryIds or query
        is required.`);
      callback(new Error(`Venues.${method}: when using radius, either categoryIds or
          query is required.`));
    }

    var sentParams = {};

    if (categoryIds) {
      sentParams.categoryId = categoryIds.join(',');
    }

    if (radius) {
      sentParams.radius = radius;
    }

    if (query) {
      sentParams.query = query;
    }

    core.callApi('/venues/search', accessToken, _extends({}, sentParams, locationParam, otherParams), callback);
  }

  var searchNear = function searchNear(place) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments[3];

    var method = 'searchNear';
    logger.enter(method);

    params = params || {};

    var _params2 = params,
        categoryIds = _params2.categoryIds,
        query = _params2.query,
        radius = _params2.radius,
        otherParams = _objectWithoutProperties(_params2, ['categoryIds', 'query', 'radius']);

    if (radius && !(categoryIds || query)) {
      logger.error(`Venues: when using radius, either categoryIds or query
        is required.`);
      callback(new Error(`Venues.${method}: when using radius, either categoryIds or
          query is required.`));
    }

    var sentParams = {};

    if (categoryIds) {
      sentParams.categoryId = categoryIds.join(',');
    }

    if (radius) {
      sentParams.radius = radius;
    }

    if (query) {
      sentParams.query = query;
    }

    core.callApi('/venues/search', accessToken, _extends({
      near: place
    }, sentParams, otherParams), callback);
  };

  var globalSearch = function globalSearch(query) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments[3];

    var method = 'globalSearch';
    logger.enter(method);

    logHelper.debugParams(_extends({ query }, params), method);

    core.callApi('/venues/search', accessToken, _extends({ intent: 'global', query }, params), callback);
  };

  var browseBox = function browseBox(northEast, southWest) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var accessToken = arguments[3];
    var callback = arguments[4];

    var method = 'browseBox';
    logger.enter(method);

    logHelper.debugParams(_extends({ northEast, southWest }, params), method);

    var passedParams = _extends({
      ne: northEast.lat + ',' + northEast.long,
      sw: southWest.lat + ',' + southWest.long
    }, params);

    core.callApi('/venues/search', accessToken, _extends({ intent: 'browse' }, passedParams), callback);
  };

  var browseCircle = function browseCircle(location, radius) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var accessToken = arguments[3];
    var callback = arguments[4];

    var method = 'browseCircle';
    logger.enter(method);

    var locationParam = _locations2.default.getLocationAPIParameter({ location }, method, 'Venues', logger, callback);

    if (!locationParam) {
      return;
    }

    logHelper.debugParams(_extends({ locationParam, radius }, params), method);

    core.callApi('/venues/search', accessToken, _extends({ intent: 'browse', radius }, locationParam, params), callback);
  };

  var match = function match(location, query) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var accessToken = arguments[3];
    var callback = arguments[4];

    var method = 'match';
    logger.enter(method);

    logHelper.debugParams(_extends({ location, query }, params), method);

    var locationParam = _locations2.default.getLocationAPIParameter({ location }, method, 'Venues', logger, callback);

    if (!locationParam) {
      return;
    }

    core.callApi('/venues/search', accessToken, _extends({ intent: 'match', query }, locationParam, params), callback);
  };

  var exploreLocation = function exploreLocation(location, radius) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var accessToken = arguments[3];
    var callback = arguments[4];

    var method = 'exploreLocation';
    logger.enter(method);

    var locationParam = _locations2.default.getLocationAPIParameter({ location }, method, 'Venues', logger, callback);

    if (!locationParam) {
      return;
    }

    var _ref = params || {},
        openNow = _ref.openNow,
        sortByDistance = _ref.sortByDistance,
        price = _ref.price,
        saved = _ref.saved,
        otherParams = _objectWithoutProperties(_ref, ['openNow', 'sortByDistance', 'price', 'saved']);

    var sentParams = _extends({}, otherParams);

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

    logHelper.debugParams(_extends({ location }, sentParams), method);

    core.callApi('/venues/explore', accessToken, _extends({}, locationParam, sentParams), callback);
  };

  var exploreNear = function exploreNear(place) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments[3];

    var method = 'exploreNear';
    logger.enter(method);

    var _ref2 = params || {},
        openNow = _ref2.openNow,
        sortByDistance = _ref2.sortByDistance,
        price = _ref2.price,
        saved = _ref2.saved,
        otherParams = _objectWithoutProperties(_ref2, ['openNow', 'sortByDistance', 'price', 'saved']);

    var sentParams = _extends({}, otherParams);

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

    logHelper.debugParams(_extends({ place }, sentParams), method);

    core.callApi('/venues/explore', accessToken, _extends({ near: place }, sentParams), callback);
  };

  var getPhotos = function getPhotos(venueId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments[3];

    var method = 'getPhotos';
    logger.enter(method);
    return getSimpleEndpoint(venueId, method, 'photos', params, accessToken, callback);
  };

  var getDetails = function getDetails(venueId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments[3];

    var method = 'getDetails';
    logger.enter(method);
    return getSimpleEndpoint(venueId, method, '', params, accessToken, callback);
  };

  var getTips = function getTips(venueId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments[3];

    var method = 'getTips';
    logger.enter(method);
    return getSimpleEndpoint(venueId, method, 'tips', params, accessToken, callback);
  };

  var getHours = function getHours(venueId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments[3];

    var method = 'getHours';
    logger.enter(method);
    return getSimpleEndpoint(venueId, method, 'hours', params, accessToken, callback);
  };

  var getMenu = function getMenu(venueId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments[3];

    var method = 'getMenu';
    logger.enter(method);
    return getSimpleEndpoint(venueId, method, 'menu', params, accessToken, callback);
  };

  var getLinks = function getLinks(venueId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments[3];

    var method = 'getLinks';
    logger.enter(method);
    return getSimpleEndpoint(venueId, method, 'links', params, accessToken, callback);
  };

  function getLocationTrending(location) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments[3];

    var method = 'getLocationTrending';
    logger.enter(method);

    var locationParam = _locations2.default.getLocationAPIParameter({ location }, method, 'Venues', logger, callback);

    if (!locationParam) {
      return;
    }

    logHelper.debugParams(params, method);

    core.callApi('/venues/trending', accessToken, _extends({}, locationParam, params), callback);
  }

  var getNearTrending = function getNearTrending(place) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments[3];

    var method = 'getNearTrending';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ place }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.callApi('/venues/search', accessToken, _extends({
      near: place
    }, params), callback);
  };

  function getLocationSuggestCompletion(location, query) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var accessToken = arguments[3];
    var callback = arguments[4];

    var method = 'getLocationSuggestCompletion';
    logger.enter(method);

    var locationParam = _locations2.default.getLocationAPIParameter({ location }, method, 'Venues', logger, callback);

    if (!locationParam) {
      return;
    }

    logHelper.debugParams(_extends({ query }, params), method);

    core.callApi('/venues/suggestcompletion', accessToken, _extends({
      query
    }, locationParam, params), callback);
  }

  var getNearSuggestCompletion = function getNearSuggestCompletion(place, query) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var accessToken = arguments[3];
    var callback = arguments[4];

    var method = 'getNearSuggestCompletion';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ place }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.callApi('/venues/search', accessToken, _extends({
      near: place
    }, params), callback);
  };

  var getBoxedSuggestCompletion = function getBoxedSuggestCompletion(northEast, southWest, query) {
    var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var accessToken = arguments[4];
    var callback = arguments[5];

    var method = 'getBoxedSuggestCompletion';
    logger.enter(method);

    logHelper.debugParams(_extends({ northEast, southWest }, params), method);

    var passedParams = _extends({
      ne: northEast.lat + ',' + northEast.long,
      sw: southWest.lat + ',' + southWest.long
    }, params);

    core.callApi('/venues/suggestcompletion', accessToken, _extends({ intent: 'browse', query }, passedParams), callback);
  };

  var getLikes = function getLikes(venueId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments[3];

    var method = 'getLikes';
    logger.enter(method);
    return getSimpleEndpoint(venueId, method, 'likes', params, accessToken, callback);
  };

  var getSimilar = function getSimilar(venueId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments[3];

    var method = 'getSimilar';
    logger.enter(method);
    return getSimpleEndpoint(venueId, method, 'similar', params, accessToken, callback);
  };

  var getEvents = function getEvents(venueId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments[3];

    var method = 'getEvents';
    logger.enter(method);
    return getSimpleEndpoint(venueId, method, 'events', params, accessToken, callback);
  };

  var getNextVenues = function getNextVenues(venueId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments[3];

    var method = 'getNextVenues';
    logger.enter(method);
    return getSimpleEndpoint(venueId, method, 'nextvenues', params, accessToken, callback);
  };

  var getListed = function getListed(venueId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments[3];

    var method = 'getListed';
    logger.enter(method);
    return getSimpleEndpoint(venueId, method, 'listed', params, accessToken, callback);
  };

  var getTimeSeriesStats = function getTimeSeriesStats(venueIds, startAt) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var accessToken = arguments[3];
    var callback = arguments[4];

    var method = 'getTimeSeriesStats';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ venueIds, startAt }, method, callback)) {
      return;
    }
    logHelper.debugParams(params, method);

    var _ref3 = params || {},
        fields = _ref3.fields,
        otherParams = _objectWithoutProperties(_ref3, ['fields']);

    fields = fields || [];
    core.callApi('/venues/timeseries', accessToken, _extends({
      venueId: venueIds.join(','),
      fields: fields.join(','),
      startAt
    }, otherParams), callback);
  };

  var getStats = function getStats(venueId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments[3];

    var method = 'getStats';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ venueId }, method, callback)) {
      return;
    }
    logHelper.debugParams(params, method);
    core.callApi(_path2.default.join('/venues', venueId, 'stats'), accessToken, params, callback);
  };

  var getManagedVenues = function getManagedVenues() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var accessToken = arguments[1];
    var callback = arguments[2];

    var method = 'getManagedVenues';
    logger.enter(method);
    logHelper.debugParams(params, method);
    core.callApi('/venues/managed', accessToken, params, callback);
  };

  var like = function like(venueId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _callbacks.empty;

    var method = 'like';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ venueId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.postApi(_path2.default.join('/venues', venueId, 'like'), accessToken, { set: 1 }, callback);
  };

  var unlike = function unlike(venueId) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var accessToken = arguments[2];
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _callbacks.empty;

    var method = 'unlike';
    logger.enter(method);

    if (!logHelper.debugAndCheckParams({ venueId }, method, callback)) {
      return;
    }

    logHelper.debugParams(params, method);

    core.postApi(_path2.default.join('/venues', venueId, 'like'), accessToken, { set: 0 }, callback);
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
    unlike
  };
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

var _locations = require('./util/locations');

var _locations2 = _interopRequireDefault(_locations);

var _callbacks = require('./util/callbacks');

var _logHelper = require('./util/logHelper');

var _logHelper2 = _interopRequireDefault(_logHelper);

var _configDefault = require('./config-default');

var _configDefault2 = _interopRequireDefault(_configDefault);

var _mergeDeep = require('./util/mergeDeep');

var _mergeDeep2 = _interopRequireDefault(_mergeDeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

module.exports = exports['default'];