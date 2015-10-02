'use strict';

var fs       = require('fs');
var path     = require('path');
var expect   = require('chai').expect;
var calipers = require('../../lib/index');
var gif      = require('../../lib/types/gif');

describe('gif', function () {

  describe('detect', function () {

    it('should return true for a GIF', function () {
      var gifPath = path.resolve(__dirname, '../fixtures/gif/245x260.gif');
      var result = gif.detect(fs.readFileSync(gifPath));
      expect(result).to.eql(true);
    });

    it('should return false for a non-GIF', function () {
      var pdfPath = path.resolve(__dirname, '../fixtures/pdf/123x456.1.pdf');
      var result = gif.detect(fs.readFileSync(pdfPath));
      expect(result).to.eql(false);
    });

  });

  describe('measure', function () {

    var gifPath = path.resolve(__dirname, '../fixtures/gif');
    var files = fs.readdirSync(gifPath);

    files.forEach(function (file) {
      var fileSplit = file.split(/x|\./);
      var width = parseInt(fileSplit[0]);
      var height = parseInt(fileSplit[1]);
      var expectedOutput = {
        type: 'gif',
        pages: [{ width: width, height: height }]
      };

      it('should return the correct dimensions for ' + file, function () {
        return calipers.measure(path.resolve(gifPath, file))
        .bind({})
        .then(function (result) {
          expect(result).to.eql(expectedOutput);
        });
      });

    });

  });

});
