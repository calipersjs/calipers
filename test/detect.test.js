'use strict';

var fs      = require('fs');
var path    = require('path');
var util = require('util');
var popen   = util.promisify(fs.open);
var detect  = require('../lib/detect');

describe('detect', () => {

  var txtPath = path.resolve(__dirname, 'fixtures/file.txt');

  var fakeTruePlugin = {
    detect: (buffer) => {
      return buffer.toString('ascii', 0, 12) === 'A text file.';
    }
  };

  var fakeFalsePlugin = {
    detect: () => {
      return false;
    }
  };

  it('should return the first plugin that returns true', async () => {
    const fd = await popen(txtPath, 'r');
    const plugin = await detect(fd, [fakeFalsePlugin, fakeTruePlugin]);
    expect(plugin).toBe(fakeTruePlugin);
  });

  it('should throw an error for an unsupported file type', async () => {
    const fd = await popen(txtPath, 'r');
    expect(detect(fd, [fakeFalsePlugin])).rejects.toThrow(Error);
  });

});
