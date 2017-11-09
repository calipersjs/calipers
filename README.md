# Calipers [![npm version](https://badge.fury.io/js/calipers.svg)](http://badge.fury.io/js/calipers) [![Build Status](https://travis-ci.org/calipersjs/calipers.svg)](https://travis-ci.org/lob/calipers)

Current file types supported: **PDF, PNG, JPEG, GIF, BMP, WEBP, SVG**

Calipers was built to provide a method of determining the dimensions of an image or PDF much faster and less resource-intensive than shelling-out to ImageMagick. At [Lob](https://lob.com) we must validate image and PDF sizes during the lifecyle of an API request. The simplest way to do this is to shell-out to ImageMagick to identify the type and size of a file. For high-traffic servers, this becomes a major bottleneck due to the inefficiency of shelling-out.

Calipers remains performant because it avoids spawning child processes and it doesn't read entire files into memory. Instead, it intelligently reads only parts of the files that are necessary to determine the type and the dimensions of the file.

# Installation

Calipers uses a plugin architecture to allow users to include support for only the specific file types they need to measure. This helps avoid wasting CPU cycles measuring file types that an application doesn't support, and ensures users must only install dependencies that are absolutely needed (e.g. Poppler for PDF support).

To use Calipers, you must install the core library and at least one plugin. For example, for PNG support:

```
npm install --save calipers calipers-png
```

### Official Plugins

Here is a list of officially supported plugins:

File Type | Plugin
--------- | ------
PNG       | [calipers-png](https://github.com/calipersjs/calipers-png)
JPEG      | [calipers-jpeg](https://github.com/calipersjs/calipers-jpeg)
PDF <sup>†</sup>    | [calipers-pdf](https://github.com/calipersjs/calipers-pdf)
GIF       | [calipers-gif](https://github.com/calipersjs/calipers-gif)
BMP       | [calipers-bmp](https://github.com/calipersjs/calipers-bmp)
WEBP      | [calipers-webp](https://github.com/calipersjs/calipers-webp)
SVG       | [calipers-svg](https://github.com/calipersjs/calipers-svg)

##### <sup>†</sup> PDF Support

The [Poppler](http://poppler.freedesktop.org/) library C++ interface is required for PDF support. You must install Poppler before running `npm install calipers-pdf`.

To install Poppler on Mac OS X using Homebrew:

```
brew install poppler
```

To install Poppler on Ubuntu:

```
apt-get install pkg-config
apt-get install libpoppler-cpp-dev
```

# Usage

Calipers must be initialized by calling the required function with supported file types passed in. Use the plugin name's suffix (everything after the first "-") as an argument.

```javascript
// Initializes Calipers with support for calipers-png, calipers-jpeg, calipers-pdf.
var Calipers = require('calipers')('png', 'jpeg', 'pdf');
```

Calipers exposes a single function, `measure`, once initialized.

### `measure(filePath, [callback])`

Measures the file at the given path.
- `filePath` - The path of the file.
- `callback` - called when the file has been measured
  - `err` - An Error is thrown for unsupported file types or corrupt files.
  - `result` - Contains keys `type` and `pages`, where `type` is a string representing the file type (e.g. `'png'`), and `pages` is an array of objects with keys `width` and `height`. For image files, `pages` always has 1 element and `width` and `height` are the integer pixel dimensions. For PDF `width` and `height` are floating-point PostScript Point dimensions.

# Examples

```js
var Calipers = require('calipers')('png', 'pdf');

// You can use a callback:
Calipers.measure('/path/to/document.pdf', function (err, result) {
  // result:
  // {
  //   type: 'pdf',
  //   pages: [
  //     {
  //       width: 450,
  //       height: 670
  //     },
  //     {
  //       width: 450,
  //       height: 670
  //     }
  //   ]
  // }
});

// Or you can use promises:
Calipers.measure('/path/to/file.png')
.then(function (result) {
  // result:
  // {
  //   type: 'png',
  //   pages: [
  //     {
  //       width: 450,
  //       height: 670
  //     }
  //   ]
  // }
});
```

# Custom Plugins

Calipers also allows custom plugins for file types that are not officially supported or application-specific measuring. A Calipers plugin is simply an object with two functions, `detect` and `measure`. 

##### `detect(buffer)`

```
@param {Buffer} buffer - a Node buffer containing the first 16 bytes of the file
@returns {Boolean} true if the given buffer is a file type supported by the plugin
```

##### `measure(path, fd)`

```
@param {String} path - the file to measure
@param {Integer} fd - an opened, read-only file descriptor of the file; do not close,
  Calipers will close file descriptors automatically
@returns {Promise<Object> | Object} an object or promise resolving an object
  containing 'type' and 'pages' fields. 'pages' is an array of objects, each with
  a 'width' and 'height'
```

The simple (and useless) example below illustrates how to create and use a custom plugin.

```javascript
var fakePlugin = {
  detect: function (buffer) {
    // Return true if the file starts with 'fake'.
    return buffer.toString('ascii', 0, 4) === 'fake';
  },
  measure: function (path, fd) {
    // Return an arbitrary measurement.
    return {
      type: 'fake',
      pages: [{
        width: 0,
        height: 0
      }]
    };
  }
};

var Calipers = require('calipers')('png', 'jpeg', fakePlugin);

Calipers.measure('path/to/file/that/starts/with/fake')
.then(function (result) {
  // result:
  // {
  //   type: 'fake',
  //   pages: [{
  //     width: 0,
  //     height: 0
  //   }]
  // }
});
```

# Benchmarks

As with all benchmarks, take these with a grain of salt. You can run the benchmarks on your own hardware by cloning the benchmark repository: https://github.com/calipersjs/benchmark.

These benchmarks show the time taken to measure 500 iterations of each file type and each method with a concurrency of 50. They were run on a Mid-2014 13" MacBook Pro with a 2.6 GHz Intel Core i5.

File Type | Shell Out Time (ms) | Calipers Time (ms)
--------- | ------------------: | -----------------:
PDF  | 2001 <sup>†</sup> | 92
PNG  | 1814 <sup>††</sup> | 34
JPEG | 1819 <sup>††</sup> | 56
GIF  | 2411 <sup>††</sup> | 36
BMP  | 1788 <sup>††</sup> | 35

<sup>†</sup> Measured by spawning a child process which runs Poppler's `pdfinfo` command.

<sup>††</sup> Measured by spawning a child process which runs ImageMagicks's `identify` command.

# Contribute

### Bug Reporting

The easiest and most helpful way to contribute is to find a file that Calipers incorrectly measures, and submit an issue or PR with the file.

### New Plugins

If there is a file type you'd like to see supported, create an issue for it and we'll do our best to support it. Also, if you've created a custom plugin that you've found useful, please consider offering it as an official plugin.

<br/><br/>
##### Inspiration

Inspired by netroy's image-size library: https://github.com/netroy/image-size
