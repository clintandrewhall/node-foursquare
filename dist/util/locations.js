"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});


var isLocationParameterValid = function isLocationParameterValid(location) {
  if (location) {
    var _lat = location.lat,
        _long = location.long;

    return !!_lat && !!_long;
  }

  return false;
};

var createLocationAPIParameters = function createLocationAPIParameters(location) {
  if (location) {
    var _accuracy = location.accuracy,
        _altitude = location.altitude,
        _altitudeAccuracy = location.altitudeAccuracy,
        _lat2 = location.lat,
        _long2 = location.long;


    var locationParams = {
      ll: `${_lat2},${_long2}`
    };

    if (_accuracy) {
      locationParams.llAcc = _accuracy;
    }

    if (_altitude) {
      locationParams.alt = _altitude;
    }

    if (_altitudeAccuracy) {
      locationParams.altitudeAccuracy = _altitudeAccuracy;
    }

    return locationParams;
  }

  return null;
};

exports.default = {
  createLocationAPIParameters,
  isLocationParameterValid,
  getLocationAPIParameter: function getLocationAPIParameter(params, method, module, logger, callback) {
    if (!params) {
      return null;
    }

    var location = params.location;


    if (!location) {
      return null;
    }

    if (!isLocationParameterValid(location)) {
      logger.error(`${method}: location parameter is not valid.`);
      callback(new Error(`${module}.${method}: location parameter is not valid.`));
      return null;
    }

    return createLocationAPIParameters(location);
  }
};
module.exports = exports["default"];