'use strict';

var path     = require('path');
var Promise  = require('bluebird');
var calipers = require('./lib/index');
var memwatch = require('memwatch-next');

memwatch.on('leak', function (info) {
  console.log(info);
});

memwatch.on('stats', function (stats) {
  console.log('\nGarbage Collected\n');
});

var ITERATIONS  = 10000000;
var CONCURRENCY =  1;

var JPEG_PATH = path.resolve(__dirname, './test/fixtures/jpeg/123x456.jpg');
var PDF_PATH  = path.resolve(__dirname, './test/fixtures/pdf/123x456.1.pdf');
var PNG_PATH  = path.resolve(__dirname, './test/fixtures/png/123x456.png');

var count = 0;

var arr = new Array(ITERATIONS);
return Promise.resolve(arr)
.each(function () {

  count += 1;
  if (count % 100000) {
    global.gc();
  }

  return calipers.measure(JPEG_PATH)
  .catch(Error, function (err) {
    console.log('ERROR:', err.message);
  });
});
//}, { concurrency: CONCURRENCY });
