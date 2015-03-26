'use strict';

var fs       = require('fs');
var bluebird = require('bluebird');

var pfstat   = bluebird.promisify(fs.fstat);
var pread    = bluebird.promisify(fs.read);

var utils    = require('../utils');
var ascii    = require('../ascii');

// Returns true if the file is a PDF file.
function isPDF (buffer) {
  return ('%PDF' === utils.ascii(buffer, 0, 4));
}

// Max number of bytes to search of items from starting points.
var SEARCH_SIZE = 1024;
var XREF_BUFFER_SIZE = 2048;

// Useful regex for parsing dictionary objects.
var TYPE_REGEX = /\/Type\s*\/(\w+)/;
var MEDIABOX_REGEX = /MediaBox\s*\[(.*)\]/;
var CROPBOX_REGEX = /CropBox\s*\[(.*)\]/;

// Finds the 'startxref' section in the file and returns the offset
// of the xref table.
function getXrefOffset (fd) {
  return pfstat(fd)
  .then(function (stat) {
    var position = stat.size - SEARCH_SIZE;
    return pread(fd, new Buffer(SEARCH_SIZE), 0, SEARCH_SIZE, position);
  })
  .spread(function (bytesRead, buffer) {
    for (var i = buffer.length - 1; i >= 0; i--) {
      if (buffer[i] === ascii.PERCENT) {
        var offsetEnd = i - 1;
      } else if (buffer[i] === ascii.S_LOW &&
          utils.ascii(buffer, i, i + 9) === 'startxref') {
        var offsetStart = i + 10;
        break;
      }
    }
    if (offsetStart && offsetEnd) {
      return parseInt(utils.ascii(buffer, offsetStart, offsetEnd));
    } else {
      throw new TypeError('Invalid PDF, could not find xref table');
    }
  });
}

// Given the start of an xref table, returns an array of
// strings for each section.
// TODO: For best performance, this should not grab a whole string and split it.
function getXrefSectionStrings (fd, offset) {
  return pread(fd, new Buffer(XREF_BUFFER_SIZE), 0, XREF_BUFFER_SIZE, offset)
  .spread(function (bytesRead, buffer) {

    if (utils.ascii(buffer, 0, 4) !== 'xref') {
      throw new TypeError('Invalid PDF, coould not find xref table');
    }

    var i = 0;
    var strings = [];
    var character, countStart, count;

    while (i < bytesRead) {
      character = buffer[i];
      if (character === ascii.SPACE) {
        countStart = i + 1;
        i += 1;
      } else if (countStart && character === ascii.NEWLINE) {
        console.log('count string:', utils.ascii(buffer, countStart, i));
        count = parseInt(utils.ascii(buffer, countStart, i));
        strings.push(utils.ascii(buffer, i + 1, i + 20 * count));
        countStart = null;
        i += 20 * count;
      } else if (character === ascii.T_LOW &&
          utils.ascii(buffer, i, i + 7) === 'trailer') {
        break;
      } else {
        i++;
      }
    }

    return strings;
  });
}

// Returns an array of integers representing the location of every
// active object listed in the given xref section string.
function parseXrefSectionString (string) {
  var objectStrings = string.split('\n');
  var offsets = [];
  objectStrings.forEach(function (object) {
    object = object.split(' ');
    if (object[2] === 'n') {
      offsets.push(parseInt(object[0]));
    }
  });
  return offsets;
}

// Returns an array of the offsets of every in-use object in the file.
function getObjectOffsets (fd, xrefOffset) {
  return getXrefSectionStrings(fd, xrefOffset)
  .then(function (sectionStrings) {
    var offsets = [];
    for (var i = 0; i < sectionStrings.length; i++) {
      offsets = offsets.concat(parseXrefSectionString(sectionStrings[i]));
    }
    return offsets;
  });
}

// Returns an object string starting at the given offset.
// Returns null if the object at the given offset is not
// of type dictionary.
function getObjectString (fd, offset) {
  return pread(fd, new Buffer(SEARCH_SIZE), 0, SEARCH_SIZE, offset)
  .spread(function (bytesRead, buffer) {
    var objFound;
    var start;
    var end = bytesRead - 1;
    var character;
    for (var i = 0; i < bytesRead; i++) {
      character = buffer[i];
      if (!objFound && character === ascii.O_LOW &&
          utils.ascii(buffer, i, i + 3) === 'obj') {
        objFound = true;
        i += 2;
      } else if (objFound && !start && character === ascii.LESS &&
          buffer[i + 1] === ascii.LESS) {
        start = i;
      } else if (objFound && !start && !utils.isWhitespace(character)) {
        // Don't allow any non-whitespace characters between
        // 'obj' and '<<'.
        throw new Error('Invalid Object');
      } else if (start && character === ascii.E_LOW &&
          utils.ascii(buffer, i, i + 6) === 'endobj') {
        end = i - 1;
        break;
      } else if (character === ascii.S_LOW &&
          utils.ascii(buffer, i, i + 6) === 'stream') {
        throw new Error('Invalid Object');
      }
    }
    if (objFound && start) {
      return utils.ascii(buffer, start, end);
    } else {
      throw new Error('Invalid Object');
    }
  });
}

// Returns an object with a width and height based on the box
// attribute.
// Returns undefined if the regex does not match the string.
function parseBox (regex, string) {
  var dict, box = regex.exec(string);
  if (box) {
    dict = {};
    box = box[1].split(' ');
    dict.width = parseInt(box[2] - box[0]);
    dict.height = parseInt(box[3] - box[1]);
  }
  return dict;
}

// Returns an object dictionary containing "mediabox" and "cropbox"
// if they exist at the offset.
// Returns an empty object if the Type of the dictionary given
// by the string is not a "Page".
function findObjectBox (fd, offset) {
  return getObjectString(fd, offset)
  .then(function (dictString) {
    console.log('object string:', dictString);
    var dict = {};
    var type = TYPE_REGEX.exec(dictString);
    if (type && type[1] === 'Page' || type[1] === 'Pages') {
      var cropBox = parseBox(CROPBOX_REGEX, dictString);
      if (cropBox) {
        return cropBox;
      }
      var mediaBox = parseBox(MEDIABOX_REGEX, dictString);
      if (mediaBox) {
        return mediaBox;
      }
    }
    console.log('throwing!');
    throw new Error('No Box Found');
  });
}

// Returns the width and height of the PDF.
function measure (fd) {
  return getXrefOffset(fd)
  .then(function (xrefOffset) {
    console.log('xref offset:', xrefOffset);
    return getObjectOffsets(fd, xrefOffset);
  })
  .then(function (objectOffsets) {
    var findObjectBoxPromises = objectOffsets.map(function (offset) {
      return findObjectBox(fd, offset);
    });

    return bluebird.any(findObjectBoxPromises)
    .then(function (result) {
      console.log('result:', result);
      result.type = 'pdf';
      return result;
    })
    .catch(bluebird.AggregateError, function (err) {
      console.log('AGGREGATE ERROR');
      throw new TypeError('Invalid PDF, could not find MediaBox or CropBox');
    });
  });
}

module.exports = {
  detect: isPDF,
  measure: measure
};
