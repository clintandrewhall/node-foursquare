'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LogHelper = function () {
  function LogHelper(moduleName, logger) {
    _classCallCheck(this, LogHelper);

    this.moduleName = moduleName;
    this.logger = logger;
  }

  _createClass(LogHelper, [{
    key: 'checkParams',
    value: function checkParams(params, method, callback) {
      for (var key in params) {
        if (!params[key]) {
          this.logger.error(`${method}: ${key} is required.`);
          callback(new Error(`${this.moduleName}.${method}: ${key} is required.`));
          return false;
        }
      }
      return true;
    }
  }, {
    key: 'debugParams',
    value: function debugParams(params, method) {
      var debug = '';
      for (var key in params) {
        if (debug.length > 0) {
          debug += ',';
        }
        debug += `${key}=${JSON.stringify(params[key])}`;
      }
      this.logger.debug(`${this.moduleName}.${method} => ${debug}`);
    }
  }, {
    key: 'debugAndCheckParams',
    value: function debugAndCheckParams(params, method, callback) {
      this.debugParams(params, method);
      return this.checkParams(params, method, callback);
    }
  }]);

  return LogHelper;
}();

exports.default = LogHelper;
module.exports = exports['default'];