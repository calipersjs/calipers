import * as fs from 'fs'

// HEADER_LENGTH is the number of bytes to initially read to determine the type
// of the given file. We read more than needed for this task, because
// for some image formats, like PNG, the dimension metadata lives close to the
// beginning of the file and we can avoid a second file read. 
const HEADER_LENGTH = 24

// Format designates a supported file type for measurement.
export const enum Format {
  UNKNOWN = 0,
  PNG = 1 << 0
}

// Result is describes the result of measuring an image file.
export interface Result {
  readonly format: Format;
  readonly width: number;
  readonly height: number;
}

// measure returns the image dimensions of the file at the given path.
export async function measure (path: string, formats: Format): Promise<Result> {
  let fd

  try {
    fd = await fs.promises.open(path, 'r')

    const header = Buffer.alloc(HEADER_LENGTH)
    await fd.read(header, 0, HEADER_LENGTH, 0)

    const format = detect(header)

    // TODO: check formats
    if (format === Format.PNG) {
      return measurePNG(header)
    }

    throw new Error('file type not supported')
  } finally {
    if (fd) {
      fd.close()
    }
  }
}

// measurePNG returns the dimenions of a PNG file.
function measurePNG (header: Buffer): Result {
  const offset = 16
  return {
    format: Format.PNG,
    width: header.readUInt32BE(offset),
    height: header.readUInt32BE(4 + offset)
  }
}

// detect returns the file format of the given header buffer. Format.UNKNOWN is
// returned if the file type is not supported.
function detect (header: Buffer): Format {
  if (ascii(header, 1, 8) === 'PNG\r\n\x1a\n' && ascii(header, 12, 16) === 'IHDR') {
    return Format.PNG
  }
  return Format.UNKNOWN
}

// ascii returns an ASCII string represented by the bytes in b from the start to
// end indexes.
function ascii (b: Buffer, start: number, end: number): string {
  return b.toString('ascii', start, end)
}
