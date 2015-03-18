'use strict';

var fs       = require('fs');
var path     = require('path');
var expect   = require('chai').expect;

var calipers = require('../../lib/index');
var pdf      = require('../../lib/types/pdf');

describe('pdf', function () {

  describe('detect', function () {
    it('should return true for a PDF', function () {
      var pdfPath = path.resolve(__dirname, '../data/pdf/123x456.pdf');
      var result = pdf.detect(fs.readFileSync(pdfPath));
      expect(result).to.eql(true);
    });

    it('should return false for a non-PDF', function () {
      var pdfPath = path.resolve(__dirname, '../data/png/123x456.png');
      var result = pdf.detect(fs.readFileSync(pdfPath));
      expect(result).to.eql(false);
    });
  });

  describe('measure', function () {
    it('should return the correct dimensions for 123x456.pdf', function () {
      var pdfPath = path.resolve(__dirname, '../data/pdf/123x456.pdf');
      return calipers.measure(pdfPath)
      .bind({})
      .then(function (result) {
        this.result = result;
      })
      .finally(function () {
        expect(this.result).to.eql({ width: 123, height: 456, type: 'pdf' });
      });
    });
  });

});
