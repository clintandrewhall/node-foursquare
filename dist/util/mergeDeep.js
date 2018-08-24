'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isPlainObject = require('is-plain-object');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _deepmerge = require('deepmerge');

var _deepmerge2 = _interopRequireDefault(_deepmerge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mergeDeep = function mergeDeep(target, source) {
  return (0, _deepmerge2.default)(target, source, {
    isMergeableObject: _isPlainObject2.default
  });
};

exports.default = mergeDeep;
module.exports = exports['default'];