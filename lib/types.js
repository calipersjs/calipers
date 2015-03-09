'use strict';

var types = [
  'pdf'
];

var typeHandlers = {};
types.forEach(function (type) {
  typeHandlers[type] = require('./types/' + type);
  typeHandlers[type].type = type;
});

module.exports = {
  names: types,
  handlers: typeHandlers
};
