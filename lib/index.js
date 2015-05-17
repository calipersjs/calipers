'use strict';

var fs      = require('fs');
var Promise = require('bluebird');
var popen   = Promise.promisify(fs.open);
var pclose  = Promise.promisify(fs.close);
var detect  = require('./detect');

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
  .finally(function () {
    return pclose(this.fd);
  })
  .nodeify(callback);
};
