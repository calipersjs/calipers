'use strict';

var ascii = require('./ascii');

// Converts part of a buffer to an ASCII string.
exports.ascii = function (buffer, start, end) {
  return buffer.toString('ascii', start, end);
};

// Returns true if the ASCII code at the give location of the buffer
// is one of the five allowed whitespace characters.
exports.isWhitespace = function (character) {
  return ascii.WHITESPACE.indexOf(character) !== -1;
};
