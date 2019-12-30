'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

var _ShapeCollection = require('../../shapes/ShapeCollection');

var _ShapeCollection2 = _interopRequireDefault(_ShapeCollection);

var _pooling = require('./pooling');

var _pooling2 = _interopRequireDefault(_pooling);

var _shape_pool = require('./shape_pool');

var _shape_pool2 = _interopRequireDefault(_shape_pool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _length = 0;
var _maxLength = 4;
var pool = (0, _index.createSizedArray)(_maxLength);

function newShapeCollection() {
  var shapeCollection = void 0;
  if (_length) {
    _length -= 1;
    shapeCollection = pool[_length];
  } else {
    shapeCollection = new _ShapeCollection2.default();
  }
  return shapeCollection;
}

function release(shapeCollection) {
  var i = void 0;
  var len = shapeCollection._length;
  for (i = 0; i < len; i += 1) {
    _shape_pool2.default.release(shapeCollection.shapes[i]);
  }
  shapeCollection._length = 0;

  if (_length === _maxLength) {
    pool = _pooling2.default.double(pool);
    _maxLength *= 2;
  }
  pool[_length] = shapeCollection;
  _length += 1;
}

var ob = {
  newShapeCollection: newShapeCollection,
  release: release
};

exports.default = ob;