'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

function double(arr) {
  return arr.concat((0, _index.createSizedArray)(arr.length));
}

exports.default = {
  double: double
};