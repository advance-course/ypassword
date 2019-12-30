'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Decorator = require('./Decorator');

var _index = require('../index');

var _bez = require('../bez');

var _bez2 = _interopRequireDefault(_bez);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShapeExpressions = function () {
  function ShapeExpressions() {
    _classCallCheck(this, ShapeExpressions);

    this.setGroupProperty = _Decorator.setGroupProperty;
    this.getValueAtTime = _Decorator.getStaticValueAtTime;
  }

  _createClass(ShapeExpressions, [{
    key: 'vertices',
    value: function vertices(prop, time) {
      var shapePath = this.v;
      if (time !== undefined) {
        shapePath = this.getValueAtTime(time, 0);
      }
      var i = void 0;
      var len = shapePath._length;
      var vertices = shapePath[prop];
      var points = shapePath.v;
      var arr = (0, _index.createSizedArray)(len);
      for (i = 0; i < len; i += 1) {
        if (prop === 'i' || prop === 'o') {
          arr[i] = [vertices[i][0] - points[i][0], vertices[i][1] - points[i][1]];
        } else {
          arr[i] = [vertices[i][0], vertices[i][1]];
        }
      }
      return arr;
    }
  }, {
    key: 'points',
    value: function points(time) {
      return this.vertices('v', time);
    }
  }, {
    key: 'inTangents',
    value: function inTangents(time) {
      return this.vertices('i', time);
    }
  }, {
    key: 'outTangents',
    value: function outTangents(time) {
      return this.vertices('o', time);
    }
  }, {
    key: 'isClosed',
    value: function isClosed() {
      return this.v.c;
    }
  }, {
    key: 'pointOnPath',
    value: function pointOnPath(perc, time) {
      var shapePath = this.v;
      if (time !== undefined) {
        shapePath = this.getValueAtTime(time, 0);
      }
      if (!this._segmentsLength) {
        this._segmentsLength = _bez2.default.getSegmentsLength(shapePath);
      }

      var segmentsLength = this._segmentsLength;
      var lengths = segmentsLength.lengths;
      var lengthPos = segmentsLength.totalLength * perc;
      var i = 0;
      var len = lengths.length;
      // let j = 0;
      // let jLen;
      var accumulatedLength = 0;
      var pt = void 0;
      while (i < len) {
        if (accumulatedLength + lengths[i].addedLength > lengthPos) {
          var initIndex = i;
          var endIndex = shapePath.c && i === len - 1 ? 0 : i + 1;
          var segmentPerc = (lengthPos - accumulatedLength) / lengths[i].addedLength;
          pt = _bez2.default.getPointInSegment(shapePath.v[initIndex], shapePath.v[endIndex], shapePath.o[initIndex], shapePath.i[endIndex], segmentPerc, lengths[i]);
          break;
        } else {
          accumulatedLength += lengths[i].addedLength;
        }
        i += 1;
      }
      if (!pt) {
        pt = shapePath.c ? [shapePath.v[0][0], shapePath.v[0][1]] : [shapePath.v[shapePath._length - 1][0], shapePath.v[shapePath._length - 1][1]];
      }
      return pt;
    }
  }, {
    key: 'vectorOnPath',
    value: function vectorOnPath(perc, time, vectorType) {
      // perc doesn't use triple equality because it can be a Number object as well as a primitive.
      perc = perc === 1 ? this.v.c ? 0 : 0.999 : perc;
      var pt1 = this.pointOnPath(perc, time);
      var pt2 = this.pointOnPath(perc + 0.001, time);
      var xLength = pt2[0] - pt1[0];
      var yLength = pt2[1] - pt1[1];
      var magnitude = Math.sqrt(Math.pow(xLength, 2) + Math.pow(yLength, 2));
      var unitVector = vectorType === 'tangent' ? [xLength / magnitude, yLength / magnitude] : [-yLength / magnitude, xLength / magnitude];
      return unitVector;
    }
  }, {
    key: 'tangentOnPath',
    value: function tangentOnPath(perc, time) {
      return this.vectorOnPath(perc, time, 'tangent');
    }
  }, {
    key: 'normalOnPath',
    value: function normalOnPath(perc, time) {
      return this.vectorOnPath(perc, time, 'normal');
    }
  }]);

  return ShapeExpressions;
}();

exports.default = ShapeExpressions;