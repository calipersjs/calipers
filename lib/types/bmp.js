'use strict';

var fs      = require('fs');
var Promise = require('bluebird');
var pread   = Promise.promisify(fs.read);
var utils   = require('../utils');

function isBMP (buffer) {
  return utils.ascii(buffer, 0, 2) === 'BM';
}

function measureWindows (buffer) {
  return {
    type: 'bmp',
    pages: [{
      width: buffer.readUInt16LE(4),
      height: buffer.readUInt16LE(8)
    }]
  };
}

function measureOS2 (buffer) {
  return {
    type: 'bmp',
    pages: [{
      width: buffer.readUInt8(4),
      height: buffer.readUInt8(6)
    }]
  };
}

function measure (path, fd) {
  return pread(fd, new Buffer(10), 0, 10, 14)
  .spread(function (bytesRead, buffer) {
    if (buffer[0] !== 0xC) {
      return measureWindows(buffer);
    }

    return measureOS2(buffer);
  });
}

module.exports = {
  detect: isBMP,
  measure: measure
};
