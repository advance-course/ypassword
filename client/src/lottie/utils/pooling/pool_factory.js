'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (initialLength, _create, _release, _clone) {
  var _length = 0;
  var _maxLength = initialLength;
  var pool = (0, _index.createSizedArray)(_maxLength);

  function newElement() {
    var element = void 0;
    if (_length) {
      _length -= 1;
      element = pool[_length];
    } else {
      element = _create();
    }
    return element;
  }

  function release(element) {
    if (_length === _maxLength) {
      pool = _pooling2.default.double(pool);
      _maxLength *= 2;
    }
    if (_release) {
      _release(element);
    }
    pool[_length] = element;
    _length += 1;
  }

  function clone() {
    var clonedElement = newElement();
    return _clone(clonedElement);
  }

  return {
    clone: clone,
    newElement: newElement,
    release: release
  };
};

var _pooling = require('./pooling');

var _pooling2 = _interopRequireDefault(_pooling);

var _index = require('../index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }