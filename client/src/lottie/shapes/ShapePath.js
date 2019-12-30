'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../utils/index');

var _point_pool = require('../utils/pooling/point_pool');

var _point_pool2 = _interopRequireDefault(_point_pool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShapePath = function () {
  function ShapePath() {
    _classCallCheck(this, ShapePath);

    this.c = false;
    this._length = 0;
    this._maxLength = 8;
    this.v = (0, _index.createSizedArray)(this._maxLength);
    this.o = (0, _index.createSizedArray)(this._maxLength);
    this.i = (0, _index.createSizedArray)(this._maxLength);
  }

  _createClass(ShapePath, [{
    key: 'setPathData',
    value: function setPathData(closed, len) {
      this.c = closed;
      this.setLength(len);
      var i = 0;
      while (i < len) {
        this.v[i] = _point_pool2.default.newElement();
        this.o[i] = _point_pool2.default.newElement();
        this.i[i] = _point_pool2.default.newElement();
        i += 1;
      }
    }
  }, {
    key: 'setLength',
    value: function setLength(len) {
      while (this._maxLength < len) {
        this.doubleArrayLength();
      }
      this._length = len;
    }
  }, {
    key: 'doubleArrayLength',
    value: function doubleArrayLength() {
      this.v = this.v.concat((0, _index.createSizedArray)(this._maxLength));
      this.i = this.i.concat((0, _index.createSizedArray)(this._maxLength));
      this.o = this.o.concat((0, _index.createSizedArray)(this._maxLength));
      this._maxLength *= 2;
    }
  }, {
    key: 'setXYAt',
    value: function setXYAt(x, y, type, pos, replace) {
      var arr = void 0;
      this._length = Math.max(this._length, pos + 1);
      if (this._length >= this._maxLength) {
        this.doubleArrayLength();
      }
      switch (type) {
        case 'v':
          arr = this.v;
          break;
        case 'i':
          arr = this.i;
          break;
        case 'o':
          arr = this.o;
          break;
        default:
          break;
      }
      if (!arr[pos] || arr[pos] && !replace) {
        arr[pos] = _point_pool2.default.newElement();
      }
      arr[pos][0] = x;
      arr[pos][1] = y;
    }
  }, {
    key: 'setTripleAt',
    value: function setTripleAt(vX, vY, oX, oY, iX, iY, pos, replace) {
      this.setXYAt(vX, vY, 'v', pos, replace);
      this.setXYAt(oX, oY, 'o', pos, replace);
      this.setXYAt(iX, iY, 'i', pos, replace);
    }
  }, {
    key: 'reverse',
    value: function reverse() {
      var newPath = new ShapePath();
      newPath.setPathData(this.c, this._length);
      var vertices = this.v;
      var outPoints = this.o;
      var inPoints = this.i;
      var init = 0;
      if (this.c) {
        newPath.setTripleAt(vertices[0][0], vertices[0][1], inPoints[0][0], inPoints[0][1], outPoints[0][0], outPoints[0][1], 0, false);
        init = 1;
      }
      var cnt = this._length - 1;
      var len = this._length;

      var i = void 0;
      for (i = init; i < len; i += 1) {
        newPath.setTripleAt(vertices[cnt][0], vertices[cnt][1], inPoints[cnt][0], inPoints[cnt][1], outPoints[cnt][0], outPoints[cnt][1], i, false);
        cnt -= 1;
      }
      return newPath;
    }
  }]);

  return ShapePath;
}();

exports.default = ShapePath;