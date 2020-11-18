import * as fs from 'fs'
import * as path from 'path'

import * as calipers from '../src'

const fixtures = path.resolve(__dirname, '../test/fixtures')

const formatMap: Record<string, calipers.Format> = {
  png: calipers.Format.PNG
}

// Load all PNG images in test/fixtures.
let files = fs.readdirSync(fixtures)
files = files.filter(function (f) { return f.endsWith('.png') })

// Test that the format, width, and height of each file is calculated correctly.
files.forEach(function (f) {
  test(f, async function () {
    const [width, height, format] = f.split(/x|\./)
    const filePath = path.resolve(fixtures, f)

    const res = await calipers.measure(filePath, calipers.Format.PNG)

    expect(res.format).toBe(formatMap[format])
    expect(res.width).toBe(parseInt(width))
    expect(res.height).toBe(parseInt(height))
  })
})
