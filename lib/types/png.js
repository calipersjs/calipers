'use strict';

var fs      = require('fs');
var Promise = require('bluebird');
var pfstat  = Promise.promisify(fs.fstat);
var pread   = Promise.promisify(fs.read);
var utils   = require('../utils');

function isPNG (buffer) {
  return 'PNG\r\n\x1a\n' === utils.ascii(buffer, 1, 8) &&
    'IHDR' === utils.ascii(buffer, 12, 16);
}

function measure (path, fd) {
  return pread(fd, new Buffer(8), 0, 8, 16)
  .spread(function (bytesRead, buffer) {
    return {
      type: 'png',
      pages: [{
        width: buffer.readUInt32BE(0),
        height: buffer.readUInt32BE(4)
      }]
    };
  });
}

module.exports = {
  detect: isPNG,
  measure: measure
};
