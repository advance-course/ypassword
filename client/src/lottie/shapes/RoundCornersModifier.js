'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ShapeModifiers = require('./ShapeModifiers');

var _PropertyFactory = require('../utils/PropertyFactory');

var _PropertyFactory2 = _interopRequireDefault(_PropertyFactory);

var _shape_pool = require('../utils/pooling/shape_pool');

var _shape_pool2 = _interopRequireDefault(_shape_pool);

var _common = require('../utils/common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RoundCornersModifier = function (_ShapeModifier) {
  _inherits(RoundCornersModifier, _ShapeModifier);

  function RoundCornersModifier() {
    _classCallCheck(this, RoundCornersModifier);

    return _possibleConstructorReturn(this, (RoundCornersModifier.__proto__ || Object.getPrototypeOf(RoundCornersModifier)).apply(this, arguments));
  }

  _createClass(RoundCornersModifier, [{
    key: 'initModifierProperties',
    value: function initModifierProperties(elem, data) {
      this.getValue = this.processKeys;
      this.rd = _PropertyFactory2.default.getProp(elem, data.r, 0, null, this);
      this._isAnimated = !!this.rd.effectsSequence.length;
    }
  }, {
    key: 'processPath',
    value: function processPath(path, round) {
      var cloned_path = _shape_pool2.default.newElement();
      cloned_path.c = path.c;
      var i = void 0;
      var len = path._length;
      var currentV = void 0;
      var currentI = void 0;
      var currentO = void 0;
      var closerV = void 0;
      // let newV;
      // let newO;
      // let newI;
      var distance = void 0;
      var newPosPerc = void 0;
      var index = 0;
      var vX = void 0;
      var vY = void 0;
      var oX = void 0;
      var oY = void 0;
      var iX = void 0;
      var iY = void 0;

      for (i = 0; i < len; i += 1) {
        currentV = path.v[i];
        currentO = path.o[i];
        currentI = path.i[i];
        if (currentV[0] === currentO[0] && currentV[1] === currentO[1] && currentV[0] === currentI[0] && currentV[1] === currentI[1]) {
          if ((i === 0 || i === len - 1) && !path.c) {
            cloned_path.setTripleAt(currentV[0], currentV[1], currentO[0], currentO[1], currentI[0], currentI[1], index);
            index += 1;
          } else {
            if (i === 0) {
              closerV = path.v[len - 1];
            } else {
              closerV = path.v[i - 1];
            }
            distance = Math.sqrt(Math.pow(currentV[0] - closerV[0], 2) + Math.pow(currentV[1] - closerV[1], 2));
            newPosPerc = distance ? Math.min(distance / 2, round) / distance : 0;
            vX = iX = currentV[0] + (closerV[0] - currentV[0]) * newPosPerc;
            vY = iY = currentV[1] - (currentV[1] - closerV[1]) * newPosPerc;
            oX = vX - (vX - currentV[0]) * _common.roundCorner;
            oY = vY - (vY - currentV[1]) * _common.roundCorner;
            cloned_path.setTripleAt(vX, vY, oX, oY, iX, iY, index);
            index += 1;

            if (i === len - 1) {
              closerV = path.v[0];
            } else {
              closerV = path.v[i + 1];
            }
            distance = Math.sqrt(Math.pow(currentV[0] - closerV[0], 2) + Math.pow(currentV[1] - closerV[1], 2));
            newPosPerc = distance ? Math.min(distance / 2, round) / distance : 0;
            vX = oX = currentV[0] + (closerV[0] - currentV[0]) * newPosPerc;
            vY = oY = currentV[1] + (closerV[1] - currentV[1]) * newPosPerc;
            iX = vX - (vX - currentV[0]) * _common.roundCorner;
            iY = vY - (vY - currentV[1]) * _common.roundCorner;
            cloned_path.setTripleAt(vX, vY, oX, oY, iX, iY, index);
            index += 1;
          }
        } else {
          cloned_path.setTripleAt(path.v[i][0], path.v[i][1], path.o[i][0], path.o[i][1], path.i[i][0], path.i[i][1], index);
          index += 1;
        }
      }
      return cloned_path;
    }
  }, {
    key: 'processShapes',
    value: function processShapes(_isFirstFrame) {
      var shapePaths = void 0;
      var i = void 0;
      var len = this.shapes.length;
      var j = void 0;
      var jLen = void 0;
      var rd = this.rd.v;

      if (rd !== 0) {
        var shapeData = void 0;
        // let newPaths;
        var localShapeCollection = void 0;
        var shapes = this.shapes,
            _mdf = this._mdf;

        for (i = 0; i < len; i += 1) {
          shapeData = shapes[i];
          // newPaths = shapeData.shape.paths;
          localShapeCollection = shapeData.localShapeCollection;
          if (!(!shapeData.shape._mdf && !_mdf && !_isFirstFrame)) {
            localShapeCollection.releaseShapes();
            shapeData.shape._mdf = true;
            shapePaths = shapeData.shape.paths.shapes;
            jLen = shapeData.shape.paths._length;
            for (j = 0; j < jLen; j += 1) {
              localShapeCollection.addShape(this.processPath(shapePaths[j], rd));
            }
          }
          shapeData.shape.paths = shapeData.localShapeCollection;
        }
      }
      if (!this.dynamicProperties.length) {
        this._mdf = false;
      }
    }
  }]);

  return RoundCornersModifier;
}(_ShapeModifiers.ShapeModifier);

exports.default = RoundCornersModifier;