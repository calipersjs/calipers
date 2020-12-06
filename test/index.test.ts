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
for (const f of files) {
  test(f, async function () {
    const [width, height, format] = f.split(/x|\./)
    const filePath = path.resolve(fixtures, f)

    const expectedFormat = formatMap[format]
    const expectedWidth = parseInt(width)
    const expectedHeight = parseInt(height)

    // Test with a file path.
    let res = await calipers.measure(filePath, calipers.Format.PNG)
    expect(res.format).toBe(expectedFormat)
    expect(res.width).toBe(expectedWidth)
    expect(res.height).toBe(expectedHeight)

    // Test with a buffer.
    const buf = await fs.promises.readFile(filePath)
    res = await calipers.measure(buf, calipers.Format.PNG)
    expect(res.format).toBe(expectedFormat)
    expect(res.width).toBe(expectedWidth)
    expect(res.height).toBe(expectedHeight)
  })
}
