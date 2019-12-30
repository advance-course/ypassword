'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ShapeModifiers = require('./ShapeModifiers');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MouseModifier = function (_ShapeModifier) {
  _inherits(MouseModifier, _ShapeModifier);

  function MouseModifier() {
    _classCallCheck(this, MouseModifier);

    return _possibleConstructorReturn(this, (MouseModifier.__proto__ || Object.getPrototypeOf(MouseModifier)).apply(this, arguments));
  }

  _createClass(MouseModifier, [{
    key: 'processKeys',
    value: function processKeys(forceRender) {
      if (this.elem.globalData.frameId === this.frameId && !forceRender) {
        return;
      }
      this._mdf = true;
    }
  }, {
    key: 'addShapeToModifier',
    value: function addShapeToModifier() {
      this.positions.push([]);
    }
  }, {
    key: 'processPath',
    value: function processPath(path, mouseCoords, positions) {
      var i = void 0;
      var len = path.v.length;
      var vValues = [];
      var oValues = [];
      var iValues = [];
      // let dist;
      var theta = void 0;
      var x = void 0;
      var y = void 0;
      // // OPTION A
      for (i = 0; i < len; i += 1) {
        if (!positions.v[i]) {
          positions.v[i] = [path.v[i][0], path.v[i][1]];
          positions.o[i] = [path.o[i][0], path.o[i][1]];
          positions.i[i] = [path.i[i][0], path.i[i][1]];
          positions.distV[i] = 0;
          positions.distO[i] = 0;
          positions.distI[i] = 0;
        }
        theta = Math.atan2(path.v[i][1] - mouseCoords[1], path.v[i][0] - mouseCoords[0]);

        x = mouseCoords[0] - positions.v[i][0];
        y = mouseCoords[1] - positions.v[i][1];
        var distance = Math.sqrt(x * x + y * y);
        positions.distV[i] += (distance - positions.distV[i]) * this.data.dc;

        positions.v[i][0] = Math.cos(theta) * Math.max(0, this.data.maxDist - positions.distV[i]) / 2 + path.v[i][0];
        positions.v[i][1] = Math.sin(theta) * Math.max(0, this.data.maxDist - positions.distV[i]) / 2 + path.v[i][1];

        theta = Math.atan2(path.o[i][1] - mouseCoords[1], path.o[i][0] - mouseCoords[0]);

        x = mouseCoords[0] - positions.o[i][0];
        y = mouseCoords[1] - positions.o[i][1];
        distance = Math.sqrt(x * x + y * y);
        positions.distO[i] += (distance - positions.distO[i]) * this.data.dc;

        positions.o[i][0] = Math.cos(theta) * Math.max(0, this.data.maxDist - positions.distO[i]) / 2 + path.o[i][0];
        positions.o[i][1] = Math.sin(theta) * Math.max(0, this.data.maxDist - positions.distO[i]) / 2 + path.o[i][1];

        theta = Math.atan2(path.i[i][1] - mouseCoords[1], path.i[i][0] - mouseCoords[0]);

        x = mouseCoords[0] - positions.i[i][0];
        y = mouseCoords[1] - positions.i[i][1];
        distance = Math.sqrt(x * x + y * y);
        positions.distI[i] += (distance - positions.distI[i]) * this.data.dc;

        positions.i[i][0] = Math.cos(theta) * Math.max(0, this.data.maxDist - positions.distI[i]) / 2 + path.i[i][0];
        positions.i[i][1] = Math.sin(theta) * Math.max(0, this.data.maxDist - positions.distI[i]) / 2 + path.i[i][1];

        // ///OPTION 1
        vValues.push(positions.v[i]);
        oValues.push(positions.o[i]);
        iValues.push(positions.i[i]);
      }

      return {
        v: vValues,
        o: oValues,
        i: iValues,
        c: path.c
      };
    }
  }, {
    key: 'processShapes',
    value: function processShapes() {
      var mouseX = this.elem.globalData.mouseX;
      var mouseY = this.elem.globalData.mouseY;
      var shapePaths = void 0;
      var i = void 0;
      var len = this.shapes.length;
      var j = void 0;
      var jLen = void 0;

      if (mouseX) {
        var localMouseCoords = this.elem.globalToLocal([mouseX, mouseY, 0]);

        var shapeData = void 0;
        var newPaths = [];
        var shapes = this.shapes,
            _mdf = this._mdf,
            positions = this.positions;

        for (i = 0; i < len; i += 1) {
          shapeData = shapes[i];
          if (!shapeData.shape._mdf && !_mdf) {
            shapeData.shape.paths = shapeData.last;
          } else {
            shapeData.shape._mdf = true;
            shapePaths = shapeData.shape.paths;
            jLen = shapePaths.length;
            for (j = 0; j < jLen; j += 1) {
              if (!positions[i][j]) {
                this.positions[i][j] = {
                  v: [],
                  o: [],
                  i: [],
                  distV: [],
                  distO: [],
                  distI: []
                };
              }
              newPaths.push(this.processPath(shapePaths[j], localMouseCoords, this.positions[i][j]));
            }
            shapeData.shape.paths = newPaths;
            shapeData.last = newPaths;
          }
        }
      }
    }
  }, {
    key: 'initModifierProperties',
    value: function initModifierProperties(elem, data) {
      this.getValue = this.processKeys;
      this.data = data;
      this.positions = [];
    }
  }]);

  return MouseModifier;
}(_ShapeModifiers.ShapeModifier);

exports.default = MouseModifier;