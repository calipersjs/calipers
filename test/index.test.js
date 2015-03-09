'use strict';

var expect   = require('chai').expect;
var path     = require('path');
var calipers = require('../lib/index');

describe('index', function () {
  var pdfPath = path.resolve(__dirname + '/data/pdf/123x456.pdf');

  it('should return the correct dimensions for 123x456.pdf with callbacks', function () {
    calipers.measure(pdfPath, function (err, result) {
      expect(result).to.eql({ type: 'pdf', width: 123, height: 456 });
    });
  });

  it('should return the correct dimensions for 123x456.pdf with promises', function () {
    calipers.measure(pdfPath)
    .bind({})
    .then(function (result) {
      this.result = result;
    })
    .finally(function () {
      expect(this.result).to.eql({ type: 'pdf', width: 123, height: 456 });
    });
  });

});
