'use strict';

var bluebird = require('bluebird');
var fs       = bluebird.promisifyAll(require('fs'));
var detect   = require('./detect');

exports.measure = function (path, callback) {
  return fs.openAsync(path, 'r')
  .bind({})
  .then(function (fd) {
    this.fd = fd;
    return fs.fstatAsync(fd);
  })
  .then(function (stat) {
    var size = stat.size;
    return fs.readAsync(this.fd, new Buffer(size), 0, size, 0);
  })
  .spread(function (bytesRead, startBuffer) {
    this.startBuffer = startBuffer;
    return detect(startBuffer);
  })
  .then(function (handler) {
    this.handler = handler;
    return handler.measure(path, this.startBuffer);
  })
  .then(function (result) {
    result.type = this.handler.type;
    return result;
  })
  .nodeify();
};
