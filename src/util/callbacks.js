/* @flow */

export type CallbackFunction = (error: ?Error, results?: any) => void;
export type ServerCallbackFunction = (
  error: ?Error,
  statusCode?: number,
  results?: any,
) => void;

module.exports = {
  empty: () => {},
};
