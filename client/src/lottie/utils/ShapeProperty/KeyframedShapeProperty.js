'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('./index');

var _shape_pool = require('../pooling/shape_pool');

var _shape_pool2 = _interopRequireDefault(_shape_pool);

var _shapeCollection_pool = require('../pooling/shapeCollection_pool');

var _shapeCollection_pool2 = _interopRequireDefault(_shapeCollection_pool);

var _ShapeExpressions2 = require('../expressions/ShapeExpressions');

var _ShapeExpressions3 = _interopRequireDefault(_ShapeExpressions2);

var _Decorator = require('../expressions/Decorator');

var _ExpressionManager = require('../expressions/ExpressionManager');

var _ExpressionManager2 = _interopRequireDefault(_ExpressionManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var KeyframedShapeProperty = function (_ShapeExpressions) {
  _inherits(KeyframedShapeProperty, _ShapeExpressions);

  function KeyframedShapeProperty(elem, data, type) {
    _classCallCheck(this, KeyframedShapeProperty);

    var _this = _possibleConstructorReturn(this, (KeyframedShapeProperty.__proto__ || Object.getPrototypeOf(KeyframedShapeProperty)).call(this));

    _this.getValue = _index.processEffectsSequence;
    _this.interpolateShape = _index.interpolateShape;
    _this.addEffect = _index.addEffect;
    _this.getShapeValueAtTime = _Decorator.getShapeValueAtTime;
    _this.initiateExpression = _ExpressionManager2.default.initiateExpression;

    _this.propType = 'shape';
    _this.comp = elem.comp;
    _this.elem = elem;
    _this.container = elem;
    _this.offsetTime = elem.data.st;
    _this.keyframes = type === 3 ? data.pt.k : data.ks.k;
    _this.k = true;
    _this.kf = true;
    // let i;
    var len = _this.keyframes[0].s[0].i.length;
    // let jLen = this.keyframes[0].s[0].i[0].length;
    _this.v = _shape_pool2.default.newElement();
    _this.v.setPathData(_this.keyframes[0].s[0].c, len);
    _this.pv = _shape_pool2.default.clone(_this.v);
    _this.localShapeCollection = _shapeCollection_pool2.default.newShapeCollection();
    _this.paths = _this.localShapeCollection;
    _this.paths.addShape(_this.v);
    _this.lastFrame = _index.initFrame;
    _this.reset = _index.resetShape;
    _this._caching = {
      lastFrame: _index.initFrame,
      lastIndex: 0
    };
    _this.effectsSequence = [_index.interpolateShapeCurrentTime.bind(_this)];
    return _this;
  }

  return KeyframedShapeProperty;
}(_ShapeExpressions3.default);

exports.default = KeyframedShapeProperty;