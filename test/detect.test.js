'use strict';

var fs      = require('fs');
var path    = require('path');
var expect  = require('chai').expect;
var Promise = require('bluebird');
var popen   = Promise.promisify(fs.open);
var detect  = require('../lib/detect');

describe('detect', function () {

  // it('should return the first handler for which detect returns true', function () {
  //   var pdfPath = path.resolve(__dirname + '/fixtures/pdf/123x456.1.pdf');
  //   return popen(pdfPath, 'r')
  //   .then(detect)
  //   .then(function (handler) {
  //     expect(handler).to.eql(pdf);
  //   });
  // });

  it('should throw an error for an unsupported file type', function () {
    var txtPath = path.resolve(__dirname + '/fixtures/txt/file.txt');
    return popen(txtPath, 'r')
    .then(function (fd) {
      return expect(detect(fd)).to.be.rejectedWith(Error);
    });
  });

});
