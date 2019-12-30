'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PropertyFactory = require('../PropertyFactory');

var _PropertyFactory2 = _interopRequireDefault(_PropertyFactory);

var _index = require('./index');

var _shape_pool = require('../pooling/shape_pool');

var _shape_pool2 = _interopRequireDefault(_shape_pool);

var _shapeCollection_pool = require('../pooling/shapeCollection_pool');

var _shapeCollection_pool2 = _interopRequireDefault(_shapeCollection_pool);

var _dynamicProperties = require('../dynamicProperties');

var _dynamicProperties2 = _interopRequireDefault(_dynamicProperties);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cPoint = 0.5519;

var EllShapeProperty = function (_DynamicPropertyConta) {
  _inherits(EllShapeProperty, _DynamicPropertyConta);

  function EllShapeProperty(elem, data) {
    _classCallCheck(this, EllShapeProperty);

    var _this = _possibleConstructorReturn(this, (EllShapeProperty.__proto__ || Object.getPrototypeOf(EllShapeProperty)).call(this));

    _this.reset = _index.resetShape;


    _this.v = _shape_pool2.default.newElement();
    _this.v.setPathData(true, 4);
    _this.localShapeCollection = _shapeCollection_pool2.default.newShapeCollection();
    _this.paths = _this.localShapeCollection;
    _this.localShapeCollection.addShape(_this.v);
    _this.d = data.d;
    _this.elem = elem;
    _this.comp = elem.comp;
    _this.frameId = -1;
    _this.initDynamicPropertyContainer(elem);
    _this.p = _PropertyFactory2.default.getProp(elem, data.p, 1, 0, _this);
    _this.s = _PropertyFactory2.default.getProp(elem, data.s, 1, 0, _this);
    if (_this.dynamicProperties.length) {
      _this.k = true;
    } else {
      _this.k = false;
      _this.convertEllToPath();
    }
    return _this;
  }

  _createClass(EllShapeProperty, [{
    key: 'getValue',
    value: function getValue() {
      if (this.elem.globalData.frameId === this.frameId) {
        return;
      }
      this.frameId = this.elem.globalData.frameId;
      this.iterateDynamicProperties();

      if (this._mdf) {
        this.convertEllToPath();
      }
    }
  }, {
    key: 'convertEllToPath',
    value: function convertEllToPath() {
      var p0 = this.p.v[0];
      var p1 = this.p.v[1];
      var s0 = this.s.v[0] / 2;
      var s1 = this.s.v[1] / 2;
      var _cw = this.d !== 3;
      var _v = this.v;
      _v.v[0][0] = p0;
      _v.v[0][1] = p1 - s1;
      _v.v[1][0] = _cw ? p0 + s0 : p0 - s0;
      _v.v[1][1] = p1;
      _v.v[2][0] = p0;
      _v.v[2][1] = p1 + s1;
      _v.v[3][0] = _cw ? p0 - s0 : p0 + s0;
      _v.v[3][1] = p1;
      _v.i[0][0] = _cw ? p0 - s0 * cPoint : p0 + s0 * cPoint;
      _v.i[0][1] = p1 - s1;
      _v.i[1][0] = _cw ? p0 + s0 : p0 - s0;
      _v.i[1][1] = p1 - s1 * cPoint;
      _v.i[2][0] = _cw ? p0 + s0 * cPoint : p0 - s0 * cPoint;
      _v.i[2][1] = p1 + s1;
      _v.i[3][0] = _cw ? p0 - s0 : p0 + s0;
      _v.i[3][1] = p1 + s1 * cPoint;
      _v.o[0][0] = _cw ? p0 + s0 * cPoint : p0 - s0 * cPoint;
      _v.o[0][1] = p1 - s1;
      _v.o[1][0] = _cw ? p0 + s0 : p0 - s0;
      _v.o[1][1] = p1 + s1 * cPoint;
      _v.o[2][0] = _cw ? p0 - s0 * cPoint : p0 + s0 * cPoint;
      _v.o[2][1] = p1 + s1;
      _v.o[3][0] = _cw ? p0 - s0 : p0 + s0;
      _v.o[3][1] = p1 - s1 * cPoint;
    }
  }]);

  return EllShapeProperty;
}(_dynamicProperties2.default);

exports.default = EllShapeProperty;