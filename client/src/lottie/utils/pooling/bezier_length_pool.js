'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pool_factory = require('./pool_factory');

var _pool_factory2 = _interopRequireDefault(_pool_factory);

var _index = require('../index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _pool_factory2.default)(8, function create() {
  return {
    addedLength: 0,
    percents: (0, _index.createTypedArray)('float32', _index.defaultCurveSegments),
    lengths: (0, _index.createTypedArray)('float32', _index.defaultCurveSegments)
  };
});