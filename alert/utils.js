'use strict';

exports.parseFloatIfNeed = function parseFloatIfNeed(val) {
  if (typeof val === 'string') {
    return parseFloat(val);
  }
  return val;
};
