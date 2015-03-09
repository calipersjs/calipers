'use strict';

var expect = require('chai').expect;
var sinon  = require('sinon');
var detect = require('../lib/detect');
var pdf    = require('../lib/types/pdf');

describe('detect', function () {

  it('should return the first handler for which detect returns true', function () {
    var pdfMock = sinon.mock(pdf);
    pdfMock.expects('detect').returns(true);
    expect(detect(new Buffer('test'))).to.eql(pdf);
    pdfMock.restore();
  });

  it('should throw an error for an unsupported file type', function () {
    var pdfMock = sinon.mock(pdf);
    pdfMock.expects('detect').returns(false);
    expect(function () { detect(new Buffer('test')) }).to.throw(TypeError);
    pdfMock.restore();
  });

});
