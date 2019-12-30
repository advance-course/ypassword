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

var _common = require('../common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RectShapeProperty = function (_DynamicPropertyConta) {
  _inherits(RectShapeProperty, _DynamicPropertyConta);

  function RectShapeProperty(elem, data) {
    _classCallCheck(this, RectShapeProperty);

    var _this = _possibleConstructorReturn(this, (RectShapeProperty.__proto__ || Object.getPrototypeOf(RectShapeProperty)).call(this));

    _this.reset = _index.resetShape;

    _this.v = _shape_pool2.default.newElement();
    _this.v.c = true;
    _this.localShapeCollection = _shapeCollection_pool2.default.newShapeCollection();
    _this.localShapeCollection.addShape(_this.v);
    _this.paths = _this.localShapeCollection;
    _this.elem = elem;
    _this.comp = elem.comp;
    _this.frameId = -1;
    _this.d = data.d;
    _this.initDynamicPropertyContainer(elem);
    _this.p = _PropertyFactory2.default.getProp(elem, data.p, 1, 0, _this);
    _this.s = _PropertyFactory2.default.getProp(elem, data.s, 1, 0, _this);
    _this.r = _PropertyFactory2.default.getProp(elem, data.r, 0, 0, _this);
    if (_this.dynamicProperties.length) {
      _this.k = true;
    } else {
      _this.k = false;
      _this.convertRectToPath();
    }
    return _this;
  }

  _createClass(RectShapeProperty, [{
    key: 'convertRectToPath',
    value: function convertRectToPath() {
      var p0 = this.p.v[0];
      var p1 = this.p.v[1];
      var v0 = this.s.v[0] / 2;
      var v1 = this.s.v[1] / 2;
      var round = (0, _common.bm_min)(v0, v1, this.r.v);
      var cPoint = round * (1 - _common.roundCorner);
      this.v._length = 0;

      if (this.d === 2 || this.d === 1) {
        this.v.setTripleAt(p0 + v0, p1 - v1 + round, p0 + v0, p1 - v1 + round, p0 + v0, p1 - v1 + cPoint, 0, true);
        this.v.setTripleAt(p0 + v0, p1 + v1 - round, p0 + v0, p1 + v1 - cPoint, p0 + v0, p1 + v1 - round, 1, true);
        if (round !== 0) {
          this.v.setTripleAt(p0 + v0 - round, p1 + v1, p0 + v0 - round, p1 + v1, p0 + v0 - cPoint, p1 + v1, 2, true);
          this.v.setTripleAt(p0 - v0 + round, p1 + v1, p0 - v0 + cPoint, p1 + v1, p0 - v0 + round, p1 + v1, 3, true);
          this.v.setTripleAt(p0 - v0, p1 + v1 - round, p0 - v0, p1 + v1 - round, p0 - v0, p1 + v1 - cPoint, 4, true);
          this.v.setTripleAt(p0 - v0, p1 - v1 + round, p0 - v0, p1 - v1 + cPoint, p0 - v0, p1 - v1 + round, 5, true);
          this.v.setTripleAt(p0 - v0 + round, p1 - v1, p0 - v0 + round, p1 - v1, p0 - v0 + cPoint, p1 - v1, 6, true);
          this.v.setTripleAt(p0 + v0 - round, p1 - v1, p0 + v0 - cPoint, p1 - v1, p0 + v0 - round, p1 - v1, 7, true);
        } else {
          this.v.setTripleAt(p0 - v0, p1 + v1, p0 - v0 + cPoint, p1 + v1, p0 - v0, p1 + v1, 2);
          this.v.setTripleAt(p0 - v0, p1 - v1, p0 - v0, p1 - v1 + cPoint, p0 - v0, p1 - v1, 3);
        }
      } else {
        this.v.setTripleAt(p0 + v0, p1 - v1 + round, p0 + v0, p1 - v1 + cPoint, p0 + v0, p1 - v1 + round, 0, true);
        if (round !== 0) {
          this.v.setTripleAt(p0 + v0 - round, p1 - v1, p0 + v0 - round, p1 - v1, p0 + v0 - cPoint, p1 - v1, 1, true);
          this.v.setTripleAt(p0 - v0 + round, p1 - v1, p0 - v0 + cPoint, p1 - v1, p0 - v0 + round, p1 - v1, 2, true);
          this.v.setTripleAt(p0 - v0, p1 - v1 + round, p0 - v0, p1 - v1 + round, p0 - v0, p1 - v1 + cPoint, 3, true);
          this.v.setTripleAt(p0 - v0, p1 + v1 - round, p0 - v0, p1 + v1 - cPoint, p0 - v0, p1 + v1 - round, 4, true);
          this.v.setTripleAt(p0 - v0 + round, p1 + v1, p0 - v0 + round, p1 + v1, p0 - v0 + cPoint, p1 + v1, 5, true);
          this.v.setTripleAt(p0 + v0 - round, p1 + v1, p0 + v0 - cPoint, p1 + v1, p0 + v0 - round, p1 + v1, 6, true);
          this.v.setTripleAt(p0 + v0, p1 + v1 - round, p0 + v0, p1 + v1 - round, p0 + v0, p1 + v1 - cPoint, 7, true);
        } else {
          this.v.setTripleAt(p0 - v0, p1 - v1, p0 - v0 + cPoint, p1 - v1, p0 - v0, p1 - v1, 1, true);
          this.v.setTripleAt(p0 - v0, p1 + v1, p0 - v0, p1 + v1 - cPoint, p0 - v0, p1 + v1, 2, true);
          this.v.setTripleAt(p0 + v0, p1 + v1, p0 + v0 - cPoint, p1 + v1, p0 + v0, p1 + v1, 3, true);
        }
      }
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      if (this.elem.globalData.frameId === this.frameId) {
        return;
      }
      this.frameId = this.elem.globalData.frameId;
      this.iterateDynamicProperties();
      if (this._mdf) {
        this.convertRectToPath();
      }
    }
  }]);

  return RectShapeProperty;
}(_dynamicProperties2.default);

exports.default = RectShapeProperty;