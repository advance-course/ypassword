'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pool_factory = require('./pool_factory');

var _pool_factory2 = _interopRequireDefault(_pool_factory);

var _ShapePath = require('../../shapes/ShapePath');

var _ShapePath2 = _interopRequireDefault(_ShapePath);

var _point_pool = require('./point_pool');

var _point_pool2 = _interopRequireDefault(_point_pool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function create() {
  return new _ShapePath2.default();
}
// import { createTypedArray } from '../index';


function release(shapePath) {
  var len = shapePath._length;
  var i = void 0;
  for (i = 0; i < len; i += 1) {
    _point_pool2.default.release(shapePath.v[i]);
    _point_pool2.default.release(shapePath.i[i]);
    _point_pool2.default.release(shapePath.o[i]);
    shapePath.v[i] = null;
    shapePath.i[i] = null;
    shapePath.o[i] = null;
  }
  shapePath._length = 0;
  shapePath.c = false;
}

var factory = (0, _pool_factory2.default)(4, create, release);
factory.clone = function clone(shape) {
  var cloned = factory.newElement();
  var i = void 0;
  var len = shape._length === undefined ? shape.v.length : shape._length;
  cloned.setLength(len);
  cloned.c = shape.c;
  // let pt;

  for (i = 0; i < len; i += 1) {
    cloned.setTripleAt(shape.v[i][0], shape.v[i][1], shape.o[i][0], shape.o[i][1], shape.i[i][0], shape.i[i][1], i);
  }
  return cloned;
};

exports.default = factory;