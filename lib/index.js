'use strict';

var fs      = require('fs');
var Promise = require('bluebird');
var popen   = Promise.promisify(fs.open);
var pclose  = Promise.promisify(fs.close);
var detect  = require('./detect');

function measure (plugins, path, callback) {
  var fileDescriptor;

  return popen(path, 'r')
  .then(function (fd) {
    fileDescriptor = fd;
    return detect(fd, plugins);
  })
  .then(function (plugin) {
    return plugin.measure(path, fileDescriptor);
  })
  .finally(function () {
    return pclose(fileDescriptor);
  })
  .asCallback(callback);
}

module.exports = function () {
  var args = Array.prototype.slice.call(arguments);

  var plugins = args.map(function (arg) {
    if (typeof arg === 'object') {
      return arg;
    } else {
      return require('calipers-' + arg);
    }
  });

  return {
    measure: measure.bind(null, plugins)
  };
};
