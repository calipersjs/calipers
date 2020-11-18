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

import * as b from 'benny'
import * as fs from 'fs'
import * as path from 'path'

import * as calipers from '../src'

const COUNT = 5
const ONE_BILLION = 1000000000

const fixtures = path.resolve(__dirname, '../test/fixtures')

// Load all PNG images in test/fixtures.
let files = fs.readdirSync(fixtures)
files = files.filter(function (f) { return f.endsWith('.png') })

// Create a benchmark for each image.
const benchmarks: any[] = []
files.forEach(function (f) {
  const [width, height, type] = f.split(/x|\./)
  const filePath = path.resolve(fixtures, f)
  const bench = b.add(`${type}-${width}x${height}`, async () => {
    await calipers.measure(filePath, calipers.Format.PNG)
  })
  for (let i = 0; i < COUNT; i++) {
    benchmarks.push(bench)
  }
})

// Run the benchmark suite.
b.suite(
  'calipers ts',
  ...benchmarks,
  b.cycle((result) => {
    // Print the results in a format that is compatible with benchstat.
    const name = result.name
    const count = result.samples
    const nsPerOp = result.details.mean * ONE_BILLION
    console.log(`BenchmarkCalipers/${name}\t${count}\t${nsPerOp} ns/op`)
  })
)
