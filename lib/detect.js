'use strict';

var types = require('./types');

module.exports = function (buffer) {
  for (var type in types.handlers) {
    var handler = types.handlers[type];
    if (handler.detect(buffer)) {
      return handler;
    }
  }
  throw new TypeError('File type not supported');
};
