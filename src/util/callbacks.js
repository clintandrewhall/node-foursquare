/* @flow */

export type CallbackFunction = (error: ?Object, results: any) => void;
export type ServerCallbackFunction = (
  error: ?Error,
  statusCode: number,
  results?: any
) => void;

export const empty = () => {};
