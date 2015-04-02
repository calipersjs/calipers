'use strict';

var fs       = require('fs');
var path     = require('path');
var expect   = require('chai').expect;
var calipers = require('../../lib/index');
var pdf      = require('../../lib/types/pdf');

describe('pdf', function () {

  describe('detect', function () {
    it('should return true for a PDF', function () {
      var pdfPath = path.resolve(__dirname, '../fixtures/pdf/123x456.1.pdf');
      var result = pdf.detect(fs.readFileSync(pdfPath));
      expect(result).to.eql(true);
    });

    it('should return false for a non-PDF', function () {
      var pngPath = path.resolve(__dirname, '../fixtures/png/123x456.png');
      var result = pdf.detect(fs.readFileSync(pngPath));
      expect(result).to.eql(false);
    });
  });

  describe('measure', function () {

    var pdfPath = path.resolve(__dirname, '../fixtures/pdf');
    var files = fs.readdirSync(pdfPath);

    files.forEach(function (file) {
      var fileSplit = file.split(/x|\./);
      var width = parseInt(fileSplit[0]);
      var height = parseInt(fileSplit[1]);
      var pages = parseInt(fileSplit[2]);

      var expectedOutput = {
        type: 'pdf',
        pages: []
      };
      for (var i = 0; i < pages; i++) {
        expectedOutput.pages[i] = { width: width, height: height };
      }

      it('should return the correct dimensions for ' + file, function () {
        return calipers.measure(path.resolve(pdfPath, file))
        .bind({})
        .then(function (result) {
          expect(result).to.eql(expectedOutput);
        });
      });
    });

  });

});
