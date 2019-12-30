'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../utils/index');

var _shape_pool = require('../utils/pooling/shape_pool');

var _shape_pool2 = _interopRequireDefault(_shape_pool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShapeCollection = function () {
  function ShapeCollection() {
    _classCallCheck(this, ShapeCollection);

    this._length = 0;
    this._maxLength = 4;
    this.shapes = (0, _index.createSizedArray)(this._maxLength);
  }

  _createClass(ShapeCollection, [{
    key: 'addShape',
    value: function addShape(shapeData) {
      if (this._length === this._maxLength) {
        this.shapes = this.shapes.concat((0, _index.createSizedArray)(this._maxLength));
        this._maxLength *= 2;
      }
      this.shapes[this._length] = shapeData;
      this._length += 1;
    }
  }, {
    key: 'releaseShapes',
    value: function releaseShapes() {
      var i = void 0;
      for (i = 0; i < this._length; i += 1) {
        _shape_pool2.default.release(this.shapes[i]);
      }
      this._length = 0;
    }
  }]);

  return ShapeCollection;
}();

exports.default = ShapeCollection;