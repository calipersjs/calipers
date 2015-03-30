'use strict';

var bluebird        = require('bluebird');
var PopplerDocument = require('poppler-simple').PopplerDocument;

var utils    = require('../utils');

function isPDF (buffer) {
  return ('%PDF' === utils.ascii(buffer, 0, 4));
}

function measure (path, fd) {
  return new bluebird(function (resolve) {
    var doc = new PopplerDocument(path);
    var page = doc.getPage(1);
    resolve({
      width: Math.round(page.width),
      height: Math.round(page.height),
      type: 'pdf'
    });
  });
}

module.exports = {
  detect: isPDF,
  measure: measure
};
