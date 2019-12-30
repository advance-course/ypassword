'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

var _pool_factory = require('./pool_factory');

var _pool_factory2 = _interopRequireDefault(_pool_factory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function create() {
  return (0, _index.createTypedArray)('float32', 2);
}

var point_pool = (0, _pool_factory2.default)(8, create);

exports.default = point_pool;