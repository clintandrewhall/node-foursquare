import winston from 'winston';

function getLoggerSettings(name) {
  return {
    console: {
      colorize: 'true',
      level: 'info',
      label: name,
    },
  };
}

function reportData(logger, test, data) {
  logger.debug(`${test} : ${data}`);
}

function reportError(logger, test, message) {
  logger.error(`${test} :  ERROR: ${message}`);
}

function reportOk(logger, test) {
  logger.info(`${test} : OK`);
}

function getLogger(name) {
  winston.loggers.add(name, getLoggerSettings(name));
  return winston.loggers.get(name);
}

module.exports = {
  getLogger,
  reportOk,
  reportData,
  reportError,
};
