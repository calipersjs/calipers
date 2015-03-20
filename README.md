# calipers
A Node.js library for measuring width and height of PDFs and images.

Calipers was motivated by high overhead and blocking of the main event loop when using `child_process.exec`. At [Lob](https://lob.com) we must validate image and PDF sizes during request-time. The simplest solution was to shell-out to ImageMagick to identify the type and size of a file. Upon investigation, this was a major bottleneck, primarily because `exec` blocks the main loop for significant periods of time. This is a currently a rough-draft, work-in-progress, proof-of-concept, yada-yada-yada.

Status: **Experimental** support for PDFs and PNGs.

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

# Installation

`npm install calipers`

# Contribute

Yes, please.

# TODO

- [ ] Hook up to Travis CI and add badge
- [X] Add PNG support
- [ ] Add JPEG support
- [ ] Generate benchmarks
- [ ] Reconfigure tests
- [ ] Add a bunch of PDFs to test
- [ ] Add a bunch of PNGs to test
- [ ] Add a bunch of JPEGs to test
- [ ] Don't grab xref sections in full strings and split to parse
- [ ] Don't grab entire objects and use regex to parse

#### Inspiration

Inspired by netroy's image-size library: https://github.com/netroy/image-size
