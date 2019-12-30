'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../utils/index');

var _PropertyFactory = require('../utils/PropertyFactory');

var _PropertyFactory2 = _interopRequireDefault(_PropertyFactory);

var _dynamicProperties = require('../utils/dynamicProperties');

var _dynamicProperties2 = _interopRequireDefault(_dynamicProperties);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DashProperty = function (_DynamicPropertyConta) {
  _inherits(DashProperty, _DynamicPropertyConta);

  function DashProperty(elem, data, renderer, container) {
    _classCallCheck(this, DashProperty);

    var _this = _possibleConstructorReturn(this, (DashProperty.__proto__ || Object.getPrototypeOf(DashProperty)).call(this));

    _this.elem = elem;
    _this.frameId = -1;
    _this.dataProps = (0, _index.createSizedArray)(data.length);
    _this.renderer = renderer;
    _this.k = false;
    _this.dashStr = '';
    _this.dashArray = (0, _index.createTypedArray)('float32', data.length ? data.length - 1 : 0);
    _this.dashoffset = (0, _index.createTypedArray)('float32', 1);
    _this.initDynamicPropertyContainer(container);
    var i = void 0;
    var len = data.length || 0;
    var prop = void 0;
    for (i = 0; i < len; i += 1) {
      prop = _PropertyFactory2.default.getProp(elem, data[i].v, 0, 0, _this);
      _this.k = prop.k || _this.k;
      _this.dataProps[i] = {
        n: data[i].n,
        p: prop
      };
    }
    if (!_this.k) {
      _this.getValue(true);
    }
    _this._isAnimated = _this.k;
    return _this;
  }

  _createClass(DashProperty, [{
    key: 'getValue',
    value: function getValue(forceRender) {
      if (this.elem.globalData.frameId === this.frameId && !forceRender) {
        return;
      }
      this.frameId = this.elem.globalData.frameId;
      this.iterateDynamicProperties();
      this._mdf = this._mdf || forceRender;
      if (this._mdf) {
        var _i = 0;
        var _len = this.dataProps.length;
        if (this.renderer === 'svg') {
          this.dashStr = '';
        }
        for (_i = 0; _i < _len; _i += 1) {
          if (this.dataProps[_i].n !== 'o') {
            if (this.renderer === 'svg') {
              this.dashStr += ' ' + this.dataProps[_i].p.v;
            } else {
              this.dashArray[_i] = this.dataProps[_i].p.v;
            }
          } else {
            this.dashoffset[0] = this.dataProps[_i].p.v;
          }
        }
      }
    }
  }]);

  return DashProperty;
}(_dynamicProperties2.default);

exports.default = DashProperty;