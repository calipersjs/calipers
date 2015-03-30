'use strict';

var fs       = require('fs');
var bluebird = require('bluebird');
var popen    = bluebird.promisify(fs.open);
var detect   = require('./detect');

exports.measure = function (path, callback) {
  return popen(path, 'r')
  .bind({})
  .then(function (fd) {
    this.fd = fd;
    return detect(fd);
  })
  .then(function (handler) {
    this.handler = handler;
    return handler.measure(path, this.fd);
  })
  .then(function (result) {
    return result;
  })
  .nodeify(callback);
};
