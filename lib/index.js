'use strict';

var fs      = require('fs');
var util    = require('util');
var popen   = util.promisify(fs.open);
var pclose  = util.promisify(fs.close);
var detect  = require('./detect');

async function measure (plugins, path, callback) {
  var fileDescriptor;

  try {
    const fd = await popen(path, 'r');
    fileDescriptor = fd;
    const plugin = await detect(fd, plugins);

    if (callback) return callback(undefined, await plugin.measure(path, fileDescriptor));

    const measurement = await plugin.measure(path, fileDescriptor);
    return measurement;
  }
  catch (err) {
    if (callback) callback(err, undefined);
    
    throw err; 
  }
  finally {
    if (fileDescriptor) {
      pclose(fileDescriptor);
    }
  }
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
