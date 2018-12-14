'use strict';

var fs      = require('fs');
var Promise = require('bluebird');
var pread   = Promise.promisify(fs.read, { multiArgs: true });
var utils   = require('./utils');

exports.detect = function (buffer) {
  return utils.ascii(buffer, 0, 3) === 'GIF';
}

exports.measure = function (path, fd) {
  return pread(fd, new Buffer(8), 0, 4, 6)
  .spread(function (bytesRead, buffer) {
    return {
      type: 'gif',
      pages: [{
        width: buffer.readUInt16LE(0),
        height: buffer.readUInt16LE(2)
      }]
    };
  });
}
