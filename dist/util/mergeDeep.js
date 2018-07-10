'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});


var isObject = function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
};

var mergeDeep = function mergeDeep(target, source) {
  var output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(function (key) {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
};

exports.default = mergeDeep;