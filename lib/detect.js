'use strict';

var fs      = require('fs');
var util = require('util');
var pread   = util.promisify(fs.read);

var DETECT_LENGTH = 16;

//Determines the appropriate plugin to use for the given file descriptor.
module.exports = async function (fd, plugins) {
  const readObject = await pread(fd, Buffer.alloc(DETECT_LENGTH), 0, DETECT_LENGTH, 0);
  for (var i = 0; i < plugins.length; i++) {
    var plugin = plugins[i];
    if (plugin.detect(readObject.buffer)) {
      return plugin;
    }
  }
  throw new Error('File type not supported');
};
