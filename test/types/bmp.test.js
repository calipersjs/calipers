'use strict';

var fs       = require('fs');
var path     = require('path');
var expect   = require('chai').expect;
var calipers = require('../../lib/index');
var bmp      = require('../../lib/types/bmp');

describe('bmp', function () {

  describe('detect', function () {

    it('should return true for a BMP', function () {
      var bmpPath = path.resolve(__dirname, '../fixtures/bmp/233x143.bmp');
      var result = bmp.detect(fs.readFileSync(bmpPath));
      expect(result).to.eql(true);
    });

    it('should return false for a non-BMP', function () {
      var pdfPath = path.resolve(__dirname, '../fixtures/pdf/123x456.1.pdf');
      var result = bmp.detect(fs.readFileSync(pdfPath));
      expect(result).to.eql(false);
    });

  });

  describe('measure', function () {

    var bmpPath = path.resolve(__dirname, '../fixtures/bmp');
    var files = fs.readdirSync(bmpPath);

    files.forEach(function (file) {
      var fileSplit = file.split(/x|\./);
      var width = parseInt(fileSplit[0]);
      var height = parseInt(fileSplit[1]);
      var expectedOutput = {
        type: 'bmp',
        pages: [{ width: width, height: height }]
      };

      it('should return the correct dimensions for ' + file, function () {
        return calipers.measure(path.resolve(bmpPath, file))
        .bind({})
        .then(function (result) {
          expect(result).to.eql(expectedOutput);
        });
      });

    });

  });

});
