'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0, descriptor; i < props.length; i++) { descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(),
    Enforce = function () {
  function Enforce(module, logger) {
    _classCallCheck(this, Enforce);

    this.module = module;
    this.logger = logger;
  }

  _createClass(Enforce, [{
    key: 'check',
    value: function check(params, method, callback) {
      for (var key in params) {
        if (!params[key]) {
          this.logger.error(`${method}: ${key} is required.`);
          callback(new Error(`${this.module}.${method}: ${key} is required.`));
          return false;
        }
      }
      return true;
    }
  }]);

  return Enforce;
}();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

exports.default = Enforce;