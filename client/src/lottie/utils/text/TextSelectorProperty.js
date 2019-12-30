'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _desc, _value, _class;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PropertyFactory = require('../PropertyFactory');

var _PropertyFactory2 = _interopRequireDefault(_PropertyFactory);

var _BezierEaser = require('../../3rd_party/BezierEaser');

var _BezierEaser2 = _interopRequireDefault(_BezierEaser);

var _Decorator = require('../expressions/Decorator');

var _dynamicProperties = require('../dynamicProperties');

var _dynamicProperties2 = _interopRequireDefault(_dynamicProperties);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var max = Math.max;
var min = Math.min;
var floor = Math.floor;

var TextSelectorProp = function (_DynamicPropertyConta) {
  _inherits(TextSelectorProp, _DynamicPropertyConta);

  function TextSelectorProp(elem, data) {
    _classCallCheck(this, TextSelectorProp);

    var _this = _possibleConstructorReturn(this, (TextSelectorProp.__proto__ || Object.getPrototypeOf(TextSelectorProp)).call(this));

    _this._currentTextLength = -1;
    _this.k = false;
    _this.data = data;
    _this.elem = elem;
    _this.comp = elem.comp;
    _this.finalS = 0;
    _this.finalE = 0;
    _this.initDynamicPropertyContainer(elem);
    _this.s = _PropertyFactory2.default.getProp(elem, data.s || {
      k: 0
    }, 0, 0, _this);
    if ('e' in data) {
      _this.e = _PropertyFactory2.default.getProp(elem, data.e, 0, 0, _this);
    } else {
      _this.e = {
        v: 100
      };
    }
    _this.o = _PropertyFactory2.default.getProp(elem, data.o || {
      k: 0
    }, 0, 0, _this);
    _this.xe = _PropertyFactory2.default.getProp(elem, data.xe || {
      k: 0
    }, 0, 0, _this);
    _this.ne = _PropertyFactory2.default.getProp(elem, data.ne || {
      k: 0
    }, 0, 0, _this);
    _this.a = _PropertyFactory2.default.getProp(elem, data.a, 0, 0.01, _this);
    if (!_this.dynamicProperties.length) {
      _this.getValue();
    }
    return _this;
  }

  _createClass(TextSelectorProp, [{
    key: 'getMult',
    value: function getMult(ind) {
      if (this._currentTextLength !== this.elem.textProperty.currentData.l.length) {
        this.getValue();
      }
      // let easer = bez.getEasingCurve(this.ne.v/100,0,1-this.xe.v/100,1);
      var easer = _BezierEaser2.default.getBezierEasing(this.ne.v / 100, 0, 1 - this.xe.v / 100, 1).get;
      var mult = 0;
      var s = this.finalS;
      var e = this.finalE;
      var type = this.data.sh;
      if (type === 2) {
        if (e === s) {
          mult = ind >= e ? 1 : 0;
        } else {
          mult = max(0, min(0.5 / (e - s) + (ind - s) / (e - s), 1));
        }
        mult = easer(mult);
      } else if (type === 3) {
        if (e === s) {
          mult = ind >= e ? 0 : 1;
        } else {
          mult = 1 - max(0, min(0.5 / (e - s) + (ind - s) / (e - s), 1));
        }

        mult = easer(mult);
      } else if (type === 4) {
        if (e === s) {
          mult = 0;
        } else {
          mult = max(0, min(0.5 / (e - s) + (ind - s) / (e - s), 1));
          if (mult < 0.5) {
            mult *= 2;
          } else {
            mult = 1 - 2 * (mult - 0.5);
          }
        }
        mult = easer(mult);
      } else if (type === 5) {
        if (e === s) {
          mult = 0;
        } else {
          var tot = e - s;
          /* ind += 0.5;
          mult = -4/(tot*tot)*(ind*ind)+(4/tot)*ind; */
          ind = min(max(0, ind + 0.5 - s), e - s);
          var x = -tot / 2 + ind;
          var a = tot / 2;
          mult = Math.sqrt(1 - x * x / (a * a));
        }
        mult = easer(mult);
      } else if (type === 6) {
        if (e === s) {
          mult = 0;
        } else {
          ind = min(max(0, ind + 0.5 - s), e - s);
          mult = (1 + Math.cos(Math.PI + Math.PI * 2 * ind / (e - s))) / 2;
          /*
           ind = Math.min(Math.max(s,ind),e-1);
           mult = (1+(Math.cos((Math.PI+Math.PI*2*(ind-s)/(e-1-s)))))/2;
           mult = Math.max(mult,(1/(e-1-s))/(e-1-s)); */
        }
        mult = easer(mult);
      } else {
        if (ind >= floor(s)) {
          if (ind - s < 0) {
            mult = 1 - (s - ind);
          } else {
            mult = max(0, min(e - ind, 1));
          }
        }
        mult = easer(mult);
      }
      return mult * this.a.v;
    }
  }, {
    key: 'getValue',
    value: function getValue(newCharsFlag) {
      this.iterateDynamicProperties();
      this._mdf = newCharsFlag || this._mdf;
      this._currentTextLength = this.elem.textProperty.currentData.l.length || 0;
      if (newCharsFlag && this.data.r === 2) {
        this.e.v = this._currentTextLength;
      }
      var divisor = this.data.r === 2 ? 1 : 100 / this._currentTextLength;
      var o = this.o.v / divisor;
      var s = this.s.v / divisor + o;
      var e = this.e.v / divisor + o;
      if (s > e) {
        var _s = s;
        s = e;
        e = _s;
      }
      this.finalS = s;
      this.finalE = e;
    }
  }]);

  return TextSelectorProp;
}(_dynamicProperties2.default);

var TextSelectorProperty = (_class = function () {
  function TextSelectorProperty() {
    _classCallCheck(this, TextSelectorProperty);
  }

  _createClass(TextSelectorProperty, [{
    key: 'getTextSelectorProp',
    value: function getTextSelectorProp(elem, data, arr) {
      return new TextSelectorProp(elem, data, arr);
    }
  }]);

  return TextSelectorProperty;
}(), (_applyDecoratedDescriptor(_class.prototype, 'getTextSelectorProp', [_Decorator.GetTextSelectorProp], Object.getOwnPropertyDescriptor(_class.prototype, 'getTextSelectorProp'), _class.prototype)), _class);
exports.default = new TextSelectorProperty();