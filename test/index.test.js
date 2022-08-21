'use strict';

var path     = require('path');

describe('index', () => {

  var txtPath = path.resolve(__dirname, 'fixtures/file.txt');
  var pngPath = path.resolve(__dirname, 'fixtures/123x456.png');
  var output = {
    type: 'txt',
    pages: [{ width: 0, height: 0 }]
  };

  var fakeTruePlugin = {
    detect: (buffer) => {
      return buffer.toString('ascii', 0, 12) === 'A text file.';
    },
    measure: () => {
      return output;
    }
  };

  var fakeFalsePlugin = {
    detect: () => {
      return false;
    }
  };

  it('works with callbacks', (done) => {
    var calipers = require('../lib/index')(fakeFalsePlugin, 'png', fakeTruePlugin);
    calipers.measure(txtPath, function (err, result) {
      expect(result).toBe(output);
      done();
    });
  });

  it('works with promises', () => {
    var calipers = require('../lib/index')(fakeFalsePlugin, fakeTruePlugin, 'png');
    return calipers.measure(txtPath)
    .then(function (result) {
      expect(result).toBe(output);
    });
  });

  it('works with required plugins', () => {
    var calipers = require('../lib/index')(fakeFalsePlugin, fakeTruePlugin, 'png');
    return calipers.measure(pngPath)
    .then(function (result) {
      expect(result).toStrictEqual({ type: 'png', pages: [{ width: 123, height: 456 }] });
    });
  });

});
