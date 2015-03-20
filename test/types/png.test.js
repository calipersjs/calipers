'use strict';

var fs       = require('fs');
var path     = require('path');
var expect   = require('chai').expect;

var calipers = require('../../lib/index');
var png      = require('../../lib/types/png');

describe('png', function () {

  describe('detect', function () {
    it('should return true for a PNG', function () {
      var pngPath = path.resolve(__dirname, '../data/png/123x456.png');
      var result = png.detect(fs.readFileSync(pngPath));
      expect(result).to.eql(true);
    });

    it('should return false for a non-PNG', function () {
      var pdfPath = path.resolve(__dirname, '../data/pdf/123x456.pdf');
      var result = png.detect(fs.readFileSync(pdfPath));
      expect(result).to.eql(false);
    });
  });

  describe('measure', function () {
    it('should return the correct dimensions for 123x456.png', function () {
      var pngPath = path.resolve(__dirname, '../data/png/123x456.png');
      return calipers.measure(pngPath)
      .bind({})
      .then(function (result) {
        this.result = result;
      })
      .catch(function (err) {
        console.log(err);
      })
      .finally(function () {
        expect(this.result).to.eql({ width: 123, height: 456, type: 'png' });
      });
    });
  });

});
