'use strict';

var types = require('./types');

// Detects the type of file based on the buffer, and returns a handler
// capable of measuring the file type.
module.exports = function (buffer) {
  for (var type in types) {
    var handler = types[type];
    if (handler.detect(buffer)) {
      return handler;
    }
  }
  throw new TypeError('File type not supported');
};
