/* flow */

import type { CallbackFunction } from './callbacks';

export default class LogHelper {
  constructor(module: string, logger: winstonLogger) {
    this.module = module;
    this.logger = logger;
  }

  checkParams(
    params: { [string]: any },
    method: string,
    callback: CallbackFunction
  ): boolean {
    for (const key in params) {
      if (!params[key]) {
        this.logger.error(`${method}: ${key} is required.`);
        callback(new Error(`${this.module}.${method}: ${key} is required.`));
        return false;
      }
    }
    return true;
  }

  debugParams(params: { [string]: any }, method: string) {
    let debug = '';
    for (const key in params) {
      if (debug.length > 0) {
        debug += ',';
      }
      debug += `${key}={params[key]}`;
    }
    this.logger.debug(`${module}:${method}:${debug}`);
  }

  debugAndCheckParams(
    params: {
      [string]: any,
    },
    method: string,
    callback: CallbackFunction
  ): boolean {
    this.debugParams(params, method);
    return this.checkParams(params, method, callback);
  }
}
