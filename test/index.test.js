'use strict';

var path     = require('path');
var expect   = require('chai').expect;

var calipers = require('../lib/index');

describe('index', function () {
  var pdfPath = path.resolve(__dirname + '/fixtures/pdf/123x456.pdf');

  it('should return the correct dimensions for 123x456.pdf with callbacks', function (done) {
    calipers.measure(pdfPath, function (err, result) {
      expect(result).to.eql({ type: 'pdf', width: 123, height: 456 });
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
      expect(this.result).to.eql({ type: 'pdf', width: 123, height: 456 });
    });
  });

});
