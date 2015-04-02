'use strict';

var path     = require('path');
var expect   = require('chai').expect;
var calipers = require('../lib/index');

describe('index', function () {
  var pdfPath = path.resolve(__dirname + '/fixtures/pdf/123x456.1.pdf');
  var expectedOutput = {
    type: 'pdf',
    pages: [{ width: 123, height: 456 }]
  };

  it('should return the correct dimensions for 123x456.pdf with callbacks', function (done) {
    calipers.measure(pdfPath, function (err, result) {
      expect(result).to.eql(expectedOutput);
      done();
    });
  });

  it('should return the correct dimensions for 123x456.pdf with promises', function () {
    return calipers.measure(pdfPath)
    .bind({})
    .then(function (result) {
      this.result = result;
    })
    .finally(function () {
      expect(this.result).to.eql(expectedOutput);
    });
  });

  it('should error for an unsupported file type', function () {
    var txtPath = path.resolve(__dirname + '/fixtures/txt/file.txt');
    return expect(calipers.measure(txtPath)).to.be.rejectedWith(Error);
  });

});
