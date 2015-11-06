'use strict';

var fs       = require('fs');
var path     = require('path');
var expect   = require('chai').expect;
var calipers = require('../../lib/index');
var svg      = require('../../lib/types/svg');

describe('svg', function () {

  describe('detect', function () {

    it('should return true for a SVG', function () {
      var svgPath = path.resolve(__dirname, '../fixtures/svg/100x60.svg');
      var result = svg.detect(fs.readFileSync(svgPath));
      expect(result).to.eql(true);
    });

    it('should return false for a non-SVG', function () {
      var pdfPath = path.resolve(__dirname, '../fixtures/pdf/123x456.1.pdf');
      var result = svg.detect(fs.readFileSync(pdfPath));
      expect(result).to.eql(false);
    });
  });

  describe('measure', function () {

    var svgPath = path.resolve(__dirname, '../fixtures/svg');
    var files = fs.readdirSync(svgPath);

    files.forEach(function (file) {
      var fileSplit = file.split(/x|\./);
      var width = parseInt(fileSplit[0]);
      var height = parseInt(fileSplit[1]);
      var expectedOutput = {
        type: 'svg',
        pages: [{ width: width, height: height }]
      };

      it('should return the correct dimensions for ' + file, function () {
        return calipers.measure(path.resolve(svgPath, file))
        .bind({})
        .then(function (result) {
          expect(result).to.eql(expectedOutput);
        });
      });
    });

    it('should error with a corrupt SVG', function () {
      var svgPath = path.resolve(__dirname, '../fixtures/corrupt/corrupt.svg');
      return expect(calipers.measure(svgPath)).to.be.rejectedWith(Error);
    });

    it('should error with a SVG with no dimensions', function () {
      var svgPath = path.resolve(__dirname, '../fixtures/corrupt/no_dimensions.svg');
      return expect(calipers.measure(svgPath)).to.be.rejectedWith(Error);
    });

  });

});
