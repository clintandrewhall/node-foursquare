// flow-typed signature: 0ab64791f05a208ec56c274ea627f653
// flow-typed version: 538388dcea/winston_v3.x.x/flow_>=v0.34.x

declare module 'winston' {
  declare export type $winstonLevels = {
    [string]: number,
  };

  declare export type $winstonNpmLogLevels = {
    error: number,
    warn: number,
    info: number,
    verbose: number,
    debug: number,
    silly: number,
  };

  declare export type $winstonInfo<T: $winstonLevels> = {
    level: $Keys<T>,
    message: string,
    [key: string]: any,
  };

  declare export type $winstonFileTransportConfig<T: $winstonLevels> = {
    filename: string,
    level?: $Keys<T>,
  };

  declare export class $winstonTransport {}

  declare export class $winstonFileTransport<T> extends $winstonTransport {
    constructor($winstonFileTransportConfig<T>): $winstonFileTransport<T>;
  }

  declare export type $winstonConsoleTransportConfig<T: $winstonLevels> = {
    level?: $Keys<T>,
  };

  declare export class $winstonConsoleTransport<T> extends $winstonTransport {
    constructor(
      config?: $winstonConsoleTransportConfig<T>
    ): $winstonConsoleTransport<T>;
  }

  declare export type $winstonLoggerConfig<T: $winstonLevels> = {
    exitOnError?: boolean,
    format?: $winstonFormat,
    level?: $Keys<T>,
    levels?: T,
    transports?: Array<$winstonTransport>,
  };

  declare export type $winstonLogger<T: $winstonLevels> = {
    [$Keys<T>]: (message: string) => void,
    add: $winstonTransport => void,
    clear: () => void,
    configure: ($winstonLoggerConfig<T>) => void,
    log: (message: $winstonInfo<T>) => void,
    remove: $winstonTransport => void,
  };

  declare export type $winstonConfigSubModule = {
    npm: () => $winstonNpmLogLevels,
  };

  declare export type $winstonTransformFunction = (
    info: $winstonInfo<$winstonLevels>,
    opts?: any
  ) => $winstonInfo<$winstonLevels> | boolean;

  declare export class $winstonFormat {
    constructor(opts?: Object): $winstonFormat;
    options?: Object;
    transform: $winstonTransformFunction;
  }

  declare export class $winstonColorizer extends $winstonFormat {
    constructor(opts?: Object): $winstonColorizer;
    createColorize: (opts?: Object) => $winstonColorizer;
    colorize: (level: string, message: string) => string;
  }

  declare export type $winstonFormatSubModule = {
    colorize: (opts?: Object) => $winstonColorizer,
    combine: (...args: Array<$winstonFormat>) => $winstonFormat,
    json: () => $winstonFormat,
    label: (config?: Object) => $winstonFormat,
    logstash: () => $winstonFormat,
    prettyPrint: () => $winstonFormat,
    printf: ((args: $winstonInfo<Object>) => string) => $winstonFormat,
    simple: () => $winstonFormat,
    timestamp: () => $winstonFormat,
  };

  declare export type $winstonDefaultLogger = $winstonLogger<
    $winstonNpmLogLevels
  >;

  declare export class $winstonContainer<T> {
    constructor(config?: $winstonLoggerConfig<T>): $winstonContainer<T>;
    add(loggerId: string, config?: $winstonLoggerConfig<T>): $winstonLogger<T>;
    get(loggerId: string): $winstonLogger<T>;
    has(id: string): boolean;
    close(id?: string): void;
  }

  declare export type AbstractConfigSetColors = {
    [key: string]: string | Array<string>,
  };

  declare export default $winstonDefaultLogger & {
    addColors: (target: AbstractConfigSetColors) => void,
    format: $winstonFormatSubModule,
    transports: {
      Console: typeof $winstonConsoleTransport,
      File: typeof $winstonFileTransport,
    },
    createLogger: <T>($winstonLoggerConfig<T>) => $winstonLogger<T>,
    Container: typeof $winstonContainer,
    loggers: $winstonContainer<*>,
  };
}
