'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../utils/index');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _cos = Math.cos;
var _sin = Math.sin;
var _tan = Math.tan;
var _rnd = Math.round;

var Matrix = function () {
  function Matrix() {
    _classCallCheck(this, Matrix);

    this._identity = true;
    this._identityCalculated = false;
    this.props = new Float32Array(16);
    this.reset();
  }

  _createClass(Matrix, [{
    key: 'reset',
    value: function reset() {
      this.props[0] = 1;
      this.props[1] = 0;
      this.props[2] = 0;
      this.props[3] = 0;
      this.props[4] = 0;
      this.props[5] = 1;
      this.props[6] = 0;
      this.props[7] = 0;
      this.props[8] = 0;
      this.props[9] = 0;
      this.props[10] = 1;
      this.props[11] = 0;
      this.props[12] = 0;
      this.props[13] = 0;
      this.props[14] = 0;
      this.props[15] = 1;
      return this;
    }
  }, {
    key: 'rotate',
    value: function rotate(angle) {
      if (angle === 0) {
        return this;
      }
      var mCos = _cos(angle);
      var mSin = _sin(angle);
      return this._t(mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
  }, {
    key: 'rotateX',
    value: function rotateX(angle) {
      if (angle === 0) {
        return this;
      }
      var mCos = _cos(angle);
      var mSin = _sin(angle);
      return this._t(1, 0, 0, 0, 0, mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1);
    }
  }, {
    key: 'rotateY',
    value: function rotateY(angle) {
      if (angle === 0) {
        return this;
      }
      var mCos = _cos(angle);
      var mSin = _sin(angle);
      return this._t(mCos, 0, mSin, 0, 0, 1, 0, 0, -mSin, 0, mCos, 0, 0, 0, 0, 1);
    }
  }, {
    key: 'rotateZ',
    value: function rotateZ(angle) {
      if (angle === 0) {
        return this;
      }
      var mCos = _cos(angle);
      var mSin = _sin(angle);
      return this._t(mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
  }, {
    key: 'shear',
    value: function shear(sx, sy) {
      return this._t(1, sy, sx, 1, 0, 0);
    }
  }, {
    key: 'skew',
    value: function skew(ax, ay) {
      return this.shear(_tan(ax), _tan(ay));
    }
  }, {
    key: 'skewFromAxis',
    value: function skewFromAxis(ax, angle) {
      var mCos = _cos(angle);
      var mSin = _sin(angle);
      return this._t(mCos, mSin, 0, 0, -mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(1, 0, 0, 0, _tan(ax), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      // return this._t(mCos, mSin, -mSin, mCos, 0, 0)._t(1, 0, _tan(ax), 1, 0, 0)._t(mCos, -mSin, mSin, mCos, 0, 0);
    }
  }, {
    key: 'scale',
    value: function scale(sx, sy, sz) {
      sz = isNaN(sz) ? 1 : sz;
      if (sx === 1 && sy === 1 && sz === 1) {
        return this;
      }
      return this._t(sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1);
    }
  }, {
    key: 'setTransform',
    value: function setTransform(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
      this.props[0] = a;
      this.props[1] = b;
      this.props[2] = c;
      this.props[3] = d;
      this.props[4] = e;
      this.props[5] = f;
      this.props[6] = g;
      this.props[7] = h;
      this.props[8] = i;
      this.props[9] = j;
      this.props[10] = k;
      this.props[11] = l;
      this.props[12] = m;
      this.props[13] = n;
      this.props[14] = o;
      this.props[15] = p;
      return this;
    }
  }, {
    key: 'translate',
    value: function translate(tx, ty, tz) {
      tz = tz || 0;
      if (tx !== 0 || ty !== 0 || tz !== 0) {
        return this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1);
      }
      return this;
    }
  }, {
    key: 'transform',
    value: function transform(a2, b2, c2, d2, e2, f2, g2, h2, i2, j2, k2, l2, m2, n2, o2, p2) {
      var _p = this.props;

      if (a2 === 1 && b2 === 0 && c2 === 0 && d2 === 0 && e2 === 0 && f2 === 1 && g2 === 0 && h2 === 0 && i2 === 0 && j2 === 0 && k2 === 1 && l2 === 0) {
        // NOTE: commenting this condition because TurboFan deoptimizes code when present
        // if(m2 !== 0 || n2 !== 0 || o2 !== 0){
        _p[12] = _p[12] * a2 + _p[15] * m2;
        _p[13] = _p[13] * f2 + _p[15] * n2;
        _p[14] = _p[14] * k2 + _p[15] * o2;
        _p[15] *= p2;
        // }
        this._identityCalculated = false;
        return this;
      }

      var a1 = _p[0];
      var b1 = _p[1];
      var c1 = _p[2];
      var d1 = _p[3];
      var e1 = _p[4];
      var f1 = _p[5];
      var g1 = _p[6];
      var h1 = _p[7];
      var i1 = _p[8];
      var j1 = _p[9];
      var k1 = _p[10];
      var l1 = _p[11];
      var m1 = _p[12];
      var n1 = _p[13];
      var o1 = _p[14];
      var p1 = _p[15];

      /* matrix order (canvas compatible):
       * ace
       * bdf
       * 001
       */
      _p[0] = a1 * a2 + b1 * e2 + c1 * i2 + d1 * m2;
      _p[1] = a1 * b2 + b1 * f2 + c1 * j2 + d1 * n2;
      _p[2] = a1 * c2 + b1 * g2 + c1 * k2 + d1 * o2;
      _p[3] = a1 * d2 + b1 * h2 + c1 * l2 + d1 * p2;

      _p[4] = e1 * a2 + f1 * e2 + g1 * i2 + h1 * m2;
      _p[5] = e1 * b2 + f1 * f2 + g1 * j2 + h1 * n2;
      _p[6] = e1 * c2 + f1 * g2 + g1 * k2 + h1 * o2;
      _p[7] = e1 * d2 + f1 * h2 + g1 * l2 + h1 * p2;

      _p[8] = i1 * a2 + j1 * e2 + k1 * i2 + l1 * m2;
      _p[9] = i1 * b2 + j1 * f2 + k1 * j2 + l1 * n2;
      _p[10] = i1 * c2 + j1 * g2 + k1 * k2 + l1 * o2;
      _p[11] = i1 * d2 + j1 * h2 + k1 * l2 + l1 * p2;

      _p[12] = m1 * a2 + n1 * e2 + o1 * i2 + p1 * m2;
      _p[13] = m1 * b2 + n1 * f2 + o1 * j2 + p1 * n2;
      _p[14] = m1 * c2 + n1 * g2 + o1 * k2 + p1 * o2;
      _p[15] = m1 * d2 + n1 * h2 + o1 * l2 + p1 * p2;

      this._identityCalculated = false;
      return this;
    }
  }, {
    key: 'isIdentity',
    value: function isIdentity() {
      var props = this.props;
      if (!this._identityCalculated) {
        this._identity = !(props[0] !== 1 || props[1] !== 0 || props[2] !== 0 || props[3] !== 0 || props[4] !== 0 || props[5] !== 1 || props[6] !== 0 || props[7] !== 0 || props[8] !== 0 || props[9] !== 0 || props[10] !== 1 || props[11] !== 0 || props[12] !== 0 || props[13] !== 0 || props[14] !== 0 || props[15] !== 1);
        this._identityCalculated = true;
      }
      return this._identity;
    }
  }, {
    key: 'equals',
    value: function equals(matr) {
      var i = 0;
      var props = this.props;
      while (i < 16) {
        if (matr.props[i] !== props[i]) {
          return false;
        }
        i += 1;
      }
      return true;
    }
  }, {
    key: 'clone',
    value: function clone(matr) {
      var i = void 0;
      var props = this.props;
      for (i = 0; i < 16; i += 1) {
        matr.props[i] = props[i];
      }
    }
  }, {
    key: 'cloneFromProps',
    value: function cloneFromProps(props) {
      var i = void 0;
      for (i = 0; i < 16; i += 1) {
        this.props[i] = props[i];
      }
    }
  }, {
    key: 'applyToPoint',
    value: function applyToPoint(x, y, z) {
      var props = this.props;
      return {
        x: x * props[0] + y * props[4] + z * props[8] + props[12],
        y: x * props[1] + y * props[5] + z * props[9] + props[13],
        z: x * props[2] + y * props[6] + z * props[10] + props[14]
      };
      /* return {
       x: x * me.a + y * me.c + me.e,
       y: x * me.b + y * me.d + me.f
       }; */
    }
  }, {
    key: 'applyToX',
    value: function applyToX(x, y, z) {
      var props = this.props;
      return x * props[0] + y * props[4] + z * props[8] + props[12];
    }
  }, {
    key: 'applyToY',
    value: function applyToY(x, y, z) {
      var props = this.props;
      return x * props[1] + y * props[5] + z * props[9] + props[13];
    }
  }, {
    key: 'applyToZ',
    value: function applyToZ(x, y, z) {
      var props = this.props;
      return x * props[2] + y * props[6] + z * props[10] + props[14];
    }
  }, {
    key: 'inversePoint',
    value: function inversePoint(pt) {
      var props = this.props;
      var determinant = props[0] * props[5] - props[1] * props[4];
      var a = props[5] / determinant;
      var b = -props[1] / determinant;
      var c = -props[4] / determinant;
      var d = props[0] / determinant;
      var e = (props[4] * props[13] - props[5] * props[12]) / determinant;
      var f = -(props[0] * props[13] - props[1] * props[12]) / determinant;
      return [pt[0] * a + pt[1] * c + e, pt[0] * b + pt[1] * d + f, 0];
    }
  }, {
    key: 'inversePoints',
    value: function inversePoints(pts) {
      var i = void 0;
      var len = pts.length;
      var retPts = [];
      for (i = 0; i < len; i += 1) {
        retPts[i] = this.inversePoint(pts[i]);
      }
      return retPts;
    }
  }, {
    key: 'applyToTriplePoints',
    value: function applyToTriplePoints(pt1, pt2, pt3) {
      var arr = (0, _index.createTypedArray)('float32', 6);
      if (this.isIdentity()) {
        arr[0] = pt1[0];
        arr[1] = pt1[1];
        arr[2] = pt2[0];
        arr[3] = pt2[1];
        arr[4] = pt3[0];
        arr[5] = pt3[1];
      } else {
        var props = this.props;
        var p0 = props[0];
        var p1 = props[1];
        var p4 = props[4];
        var p5 = props[5];
        var p12 = props[12];
        var p13 = props[13];
        arr[0] = pt1[0] * p0 + pt1[1] * p4 + p12;
        arr[1] = pt1[0] * p1 + pt1[1] * p5 + p13;
        arr[2] = pt2[0] * p0 + pt2[1] * p4 + p12;
        arr[3] = pt2[0] * p1 + pt2[1] * p5 + p13;
        arr[4] = pt3[0] * p0 + pt3[1] * p4 + p12;
        arr[5] = pt3[0] * p1 + pt3[1] * p5 + p13;
      }
      return arr;
    }
  }, {
    key: 'applyToPointArray',
    value: function applyToPointArray(x, y, z) {
      var arr = void 0;
      if (this.isIdentity()) {
        arr = [x, y, z];
      } else {
        var props = this.props;
        arr = [x * props[0] + y * props[4] + z * props[8] + props[12], x * props[1] + y * props[5] + z * props[9] + props[13], x * props[2] + y * props[6] + z * props[10] + props[14]];
      }
      return arr;
    }
  }, {
    key: 'applyToPointStringified',
    value: function applyToPointStringified(x, y) {
      if (this.isIdentity()) {
        return x + ',' + y;
      }
      var _p = this.props;
      return Math.round((x * _p[0] + y * _p[4] + _p[12]) * 100) / 100 + ',' + Math.round((x * _p[1] + y * _p[5] + _p[13]) * 100) / 100;
    }
  }, {
    key: 'toCSS',
    value: function toCSS() {
      // Doesn't make much sense to add this optimization. If it is an identity matrix, it's very likely this will get called only once since it won't be keyframed.
      /* if(this.isIdentity()) {
          return '';
      } */
      var i = 0;
      var props = this.props;
      var cssValue = 'matrix3d(';
      var v = 10000;
      while (i < 16) {
        cssValue += _rnd(props[i] * v) / v;
        cssValue += i === 15 ? ')' : ',';
        i += 1;
      }
      return cssValue;
    }
  }, {
    key: 'roundMatrixProperty',
    value: function roundMatrixProperty(val) {
      var v = 10000;
      if (val < 0.000001 && val > 0 || val > -0.000001 && val < 0) {
        return _rnd(val * v) / v;
      }
      return val;
    }
  }, {
    key: 'to2dCSS',
    value: function to2dCSS() {
      // Doesn't make much sense to add this optimization. If it is an identity matrix, it's very likely this will get called only once since it won't be keyframed.
      /* if(this.isIdentity()) {
          return '';
      } */
      var props = this.props;
      var roundMatrixProperty = this.roundMatrixProperty;
      var _a = roundMatrixProperty(props[0]);
      var _b = roundMatrixProperty(props[1]);
      var _c = roundMatrixProperty(props[4]);
      var _d = roundMatrixProperty(props[5]);
      var _e = roundMatrixProperty(props[12]);
      var _f = roundMatrixProperty(props[13]);
      return 'matrix(' + _a + ',' + _b + ',' + _c + ',' + _d + ',' + _e + ',' + _f + ')';
    }
  }, {
    key: '_t',
    value: function _t() {
      return this.transform.apply(this, arguments);
    }
  }]);

  return Matrix;
}();

exports.default = Matrix;