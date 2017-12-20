/* @flow */

export type LocationParameter = {
  accuracy?: number,
  altitude?: number,
  altitudeAccuracy?: number,
  lat: number,
  long: number,
};

export type LocationAPIParameters = {
  location: {
    alt?: number,
    altAcc?: number,
    ll: string,
    llAcc?: number,
  },
};

function isLocationParameterValid(location: ?LocationParameter): boolean {
  if (location) {
    const {lat, long} = location;
    return !((lat && !long) || (!lat && long));
  }

  return false;
}

function createLocationAPIParameters(
  location: ?LocationParameter,
): ?LocationAPIParameters {
  if (location) {
    const {accuracy, altitude, altitudeAccuracy, lat, long} = location;

    const locationParams: Object = {
      ll: `${lat},${long}`,
    };

    if (accuracy) {
      locationParams.llAcc = accuracy;
    }

    if (altitude) {
      locationParams.alt = altitude;
    }

    if (altitudeAccuracy) {
      locationParams.altitudeAccuracy = altitudeAccuracy;
    }

    return {
      location: locationParams,
    };
  }

  return null;
}

function getLocationAPIParameter(
  params?: ?{
    location?: LocationParameter,
  },
  method: string,
  module: string,
  logger: any,
  callback: Function,
): ?LocationAPIParameters {
  if (!params) {
    return null;
  }

  const {location} = params;

  if (!location) {
    return null;
  }

  if (!isLocationParameterValid(location)) {
    logger.error(`${method}: location parameter is not valid.`);
    callback(
      new Error(`${module}.${method}: location parameter is not valid.`),
    );
    return null;
  }

  return createLocationAPIParameters(location);
}

module.exports = {
  createLocationAPIParameters,
  getLocationAPIParameter,
  isLocationParameterValid,
};
