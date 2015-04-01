# calipers [![npm version](https://badge.fury.io/js/calipers.svg)](http://badge.fury.io/js/calipers) [![Build Status](https://travis-ci.org/lob/calipers.svg)](https://travis-ci.org/lob/calipers)

A Node.js library for measuring width and height of PDFs and images.

Calipers was motivated by high overhead and blocking of the main event loop when using `child_process.exec`. At [Lob](https://lob.com) we must validate image and PDF sizes during request-time. The simplest solution was to shell-out to ImageMagick to identify the type and size of a file. Upon investigation, this was a major bottleneck, primarily because `exec` blocks the main loop for significant periods of time.

Status: Support for PDFs, PNGs and JPEGs.

# Examples

```js
var calipers = require('calipers');

// You can use a callback:
calipers.measure('/path/to/image.png', function (err, result) {
  // result:
  // {
  //   width: 450,
  //   height: 670,
  //   type: 'pdf'
  // }
});

// Or you can use promises:
calipers.measure('/path/to/file.pdf')
.then(function (result) {
  // result:
  // {
  //   width: 450,
  //   height: 670,
  //   type: 'pdf'
  // }
});
```

Note that a `TypeError` may be thrown if calipers is unable to parse a file.

# Installation

```
npm install calipers
```

You'll also need to install [Poppler](http://poppler.freedesktop.org/) for PDF support.

On Mac OS X using Homebrew:

```
brew install poppler
```

On Ubuntu:

```
apt-get install libpoppler-cpp-dev
```

# Contribute

Yes, please.

# TODO

- [X] Hook up to Travis CI and add badge
- [X] Add PNG support
- [X] Add JPEG support
- [X] Reconfigure tests
- [X] Add a bunch of PDFs to test
- [ ] Add a bunch of PNGs to test (just drop them in the fixtures folder and name them by dimension)
- [ ] Add a bunch of JPEGs to test (just drop them in the fixtures folder and name them by dimension)
- [ ] How to best handle PDFs with decimal dimensions?
- [ ] Support for multiple pages - probably will change the results object
- [ ] Create benchmarks

#### Inspiration

Inspired by netroy's image-size library: https://github.com/netroy/image-size
