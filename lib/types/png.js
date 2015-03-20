'use strict';

var fs       = require('fs');
var bluebird = require('bluebird');

var pfstat   = bluebird.promisify(fs.fstat);
var pread    = bluebird.promisify(fs.read);

var utils    = require('../utils');

function isPNG (buffer) {
  return 'PNG\r\n\x1a\n' === utils.ascii(buffer, 1, 8) &&
    'IHDR' === utils.ascii(buffer, 12, 16);
}

function measure (fd) {
  return pread(fd, new Buffer(8), 0, 8, 16)
  .spread(function (bytesRead, buffer) {
    return {
      width: buffer.readUInt32BE(0),
      height: buffer.readUInt32BE(4),
      type: 'png'
    };
  });
}

module.exports = {
  detect: isPNG,
  measure: measure
};
