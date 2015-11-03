'use strict';

var fs       = require('fs');
var path     = require('path');
var expect   = require('chai').expect;
var calipers = require('../../lib/index');
var webp      = require('../../lib/types/webp');

describe('webp', function () {

  describe('detect', function () {
    it('should return true for a WEBP', function () {
      var webpPath = path.resolve(__dirname, '../fixtures/webp/213x322.lossy.webp');
      var result = webp.detect(fs.readFileSync(webpPath));
      expect(result).to.eql(true);
    });

    it('should return false for a non-WEBP', function () {
      var pdfPath = path.resolve(__dirname, '../fixtures/pdf/123x456.1.pdf');
      var result = webp.detect(fs.readFileSync(pdfPath));
      expect(result).to.eql(false);
    });
  });

  describe('measure', function () {

    var webpPath = path.resolve(__dirname, '../fixtures/webp');
    var files = fs.readdirSync(webpPath);

    files.forEach(function (file) {
      var fileSplit = file.split(/x|\./);
      var width = parseInt(fileSplit[0]);
      var height = parseInt(fileSplit[1]);
      var expectedOutput = {
        type: 'webp',
        pages: [{ width: width, height: height }]
      };

      it('should return the correct dimensions for ' + file, function () {
        return calipers.measure(path.resolve(webpPath, file))
        .bind({})
        .then(function (result) {
          expect(result).to.eql(expectedOutput);
        });
      });
    });

    it('should error with a corrupt WEBP', function () {
      var webpPath = path.resolve(__dirname, '../fixtures/corrupt/corrupt.webp');
      return expect(calipers.measure(webpPath)).to.be.rejectedWith(Error);
    });

  });

});
