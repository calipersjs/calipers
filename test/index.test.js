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

  it('errors out correctly with callbacks', (done) => {
    var calipers = require('../lib/index')(fakeFalsePlugin, 'png', fakeFalsePlugin);
    calipers.measure(txtPath, function (err, result) {
    }).catch((err) => {
      expect(err.message).toMatch('File type not supported');
      done()
    });
  });

  it('works with promises', () => {
    var calipers = require('../lib/index')(fakeFalsePlugin, fakeTruePlugin, 'png');
    return calipers.measure(txtPath)
    .then(function (result) {
      expect(result).toBe(output);
    });
  });

  it('errors with promises', async () => {
    var calipers = require('../lib/index')(fakeFalsePlugin, fakeFalsePlugin, 'png');
    try {
      await calipers.measure(txtPath);
    } catch(err) {
      expect(err.message).toMatch('File type not supported');
    }

  });

  it('works with required plugins', () => {
    var calipers = require('../lib/index')(fakeFalsePlugin, fakeTruePlugin, 'png');
    return calipers.measure(pngPath)
    .then(function (result) {
      expect(result).toStrictEqual({ type: 'png', pages: [{ width: 123, height: 456 }] });
    });
  });

});
