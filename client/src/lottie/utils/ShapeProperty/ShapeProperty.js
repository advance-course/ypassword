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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ShapeProperty = function (_ShapeExpressions) {
  _inherits(ShapeProperty, _ShapeExpressions);

  function ShapeProperty(elem, data, type) {
    _classCallCheck(this, ShapeProperty);

    var _this = _possibleConstructorReturn(this, (ShapeProperty.__proto__ || Object.getPrototypeOf(ShapeProperty)).call(this));

    _this.addEffect = _index.addEffect;
    _this.interpolateShape = _index.interpolateShape;
    _this.getValue = _index.processEffectsSequence;

    _this.propType = 'shape';
    _this.comp = elem.comp;
    _this.container = elem;
    _this.elem = elem;
    _this.data = data;
    _this.k = false;
    _this.kf = false;
    _this._mdf = false;
    var pathData = type === 3 ? data.pt.k : data.ks.k;
    _this.v = _shape_pool2.default.clone(pathData);
    _this.pv = _shape_pool2.default.clone(_this.v);
    _this.localShapeCollection = _shapeCollection_pool2.default.newShapeCollection();
    _this.paths = _this.localShapeCollection;
    _this.paths.addShape(_this.v);
    _this.reset = _index.resetShape;
    _this.effectsSequence = [];
    return _this;
  }

  return ShapeProperty;
}(_ShapeExpressions3.default);

exports.default = ShapeProperty;