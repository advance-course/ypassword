'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pool_factory = require('./pool_factory');

var _pool_factory2 = _interopRequireDefault(_pool_factory);

var _bezier_length_pool = require('./bezier_length_pool');

var _bezier_length_pool2 = _interopRequireDefault(_bezier_length_pool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function create() {
  return {
    lengths: [],
    totalLength: 0
  };
}

function release(element) {
  var i;
  var len = element.lengths.length;
  for (i = 0; i < len; i += 1) {
    _bezier_length_pool2.default.release(element.lengths[i]);
  }
  element.lengths.length = 0;
}

exports.default = (0, _pool_factory2.default)(8, create, release);