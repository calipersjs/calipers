'use strict';

var fs       = require('fs');
var bluebird = require('bluebird');

var pread    = bluebird.promisify(fs.read);
var popen    = bluebird.promisify(fs.open);

var detect   = require('./detect');

var DETECT_SIZE = 16;

exports.measure = function (path, callback) {
  return popen(path, 'r')
  .bind({})
  .then(function (fd) {
    this.fd = fd;
    return pread(fd, new Buffer(DETECT_SIZE), 0, DETECT_SIZE, 0);
  })
  .spread(function (bytesRead, startBuffer) {
    return detect(startBuffer);
  })
  .then(function (handler) {
    this.handler = handler;
    return handler.measure(this.fd);
  })
  .then(function (result) {
    return result;
  })
  .nodeify(callback);
};
