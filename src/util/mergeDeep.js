/* @flow */

import isPlainObject from 'is-plain-object';
import merge from 'deepmerge';

const mergeDeep = (target: Object, source: Object): Object => {
  return merge(target, source, {
    isMergeableObject: isPlainObject,
  });
};

export default mergeDeep;
