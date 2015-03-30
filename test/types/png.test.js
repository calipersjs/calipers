'use strict';

var fs       = require('fs');
var path     = require('path');
var expect   = require('chai').expect;

var calipers = require('../../lib/index');
var png      = require('../../lib/types/png');

describe('png', function () {

  describe('detect', function () {
    it('should return true for a PNG', function () {
      var pngPath = path.resolve(__dirname, '../fixtures/png/123x456.png');
      var result = png.detect(fs.readFileSync(pngPath));
      expect(result).to.eql(true);
    });

    it('should return false for a non-PNG', function () {
      var pdfPath = path.resolve(__dirname, '../fixtures/pdf/123x456.pdf');
      var result = png.detect(fs.readFileSync(pdfPath));
      expect(result).to.eql(false);
    });
  });

  describe('measure', function () {

    var pngPath = path.resolve(__dirname, '../fixtures/png');
    var files = fs.readdirSync(pngPath);

    files.forEach(function (file) {
      var fileSplit = file.split(/x|\./);
      var width = parseInt(fileSplit[0]);
      var height = parseInt(fileSplit[1]);

      it('should return the correct dimensions for ' + file, function () {
        return calipers.measure(path.resolve(pngPath, file))
        .bind({})
        .then(function (result) {
          expect(result).to.eql({ width: width, height: height, type: 'png' });
        });
      });
    });

  });

});
