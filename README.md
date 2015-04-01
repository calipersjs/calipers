# calipers [![npm version](https://badge.fury.io/js/calipers.svg)](http://badge.fury.io/js/calipers) [![Build Status](https://travis-ci.org/lob/calipers.svg)](https://travis-ci.org/lob/calipers)

The fastest Node.js library for measuring image and PDF dimensions.

**Status**: Basic support for PDFs, PNGs and JPEGs.

Calipers was built to provide method of determining the dimensions of an image or PDF much faster and less resource-intensive than shelling-out to ImageMagick. At [Lob](https://lob.com) we must validate image and PDF sizes during request-time. The simplest way to do this is to shell-out to ImageMagick to identify the type and size of a file. For high-traffic servers, this becomes a major bottleneck, primarily because `child_process.exec` blocks the main event loop for significant periods of time, not during the child process' execution, but while the child process is being spawned.

Calipers remains performant because it avoids spawning child processes and it doesn't read entire files into memory. Instead, it intelligently reads only parts of the files that are necessary to determine the type and the dimensions of the file.

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

Note that a `TypeError` may be thrown if the file type is not supported or calipers is unable to parse a file.

# Benchmarks

Coming Soon...

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
