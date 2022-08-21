'use strict';

// This script runs benchmarks that measure the performance of Calipers.
//
// To run these benchmarks:
//
//   npm run bench
//
// The output of this script is a format that is compatible with benchstat
// (https://godoc.org/golang.org/x/perf/cmd/benchstat). This makes it easy to
// compare the performance of different versions of Calipers. For example:
//
//   npm run bench > before
//
//   [checkout another version of Calipers]
//
//   npm run bench > after
//
//   benchstat before after
//

const b    = require('benny');
const fs   = require('fs');
const path = require('path');

const Calipers = require('../lib')('png');

// COUNT is the number of times a benchmark is run for each fixture.
const COUNT = 5;

// NS_PER_S is the number of nanoseconds in a second.
const NS_PER_S = 1000000000;

const fixtures = path.resolve(__dirname, '../test/fixtures');
const files = fs.readdirSync(fixtures);

// Create a benchmark  for each file in fixtures.
const benchmarks = [];
files.filter((file) => {
  // Only benchmark PNG files.
  return file.endsWith('.png');
}).forEach((file) => {
  const [width, height, type] = file.split(/x|\./);
  const filePath = path.resolve(fixtures, file);
  for (let i = 0; i < COUNT; i++) {
    const bench = b.add(`${type}-${width}x${height}`, async () => {
      await Calipers.measure(filePath);
    });
    benchmarks.push(bench);
  }
});

// Run the benchmark suite.
b.suite(
  'calipers',
  ...benchmarks,
  b.cycle((result) => {
    // Print the results in a format that is compatible with benchstat.
    const name = result.name;
    const count = result.samples;
    const nsPerOp = result.details.mean * NS_PER_S;
    console.log(`BenchmarkCalipers/${name}\t${count}\t${nsPerOp} ns/op`);
  }),
);
