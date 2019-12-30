'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mixin = require('../utils/mixin');

var _mixin2 = _interopRequireDefault(_mixin);

var _CompElement = require('../elements/CompElement');

var _CompElement2 = _interopRequireDefault(_CompElement);

var _CVBaseElement = require('./CVBaseElement');

var _CVBaseElement2 = _interopRequireDefault(_CVBaseElement);

var _PropertyFactory = require('../utils/PropertyFactory');

var _PropertyFactory2 = _interopRequireDefault(_PropertyFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CVCompElementClass = void 0;

exports.default = function (CanvasRenderer) {
  if (CVCompElementClass) return CVCompElementClass;
  CVCompElementClass = function (_Mixin) {
    _inherits(CVCompElement, _Mixin);

    function CVCompElement(data, globalData, comp) {
      _classCallCheck(this, CVCompElement);

      var _this = _possibleConstructorReturn(this, (CVCompElement.__proto__ || Object.getPrototypeOf(CVCompElement)).call(this));

      _this.completeLayers = false;
      _this.layers = data.layers || [];
      _this.pendingElements = [];
      _this.elements = Array.apply(null, {
        length: _this.layers.length
      });
      _this.initElement(data, globalData, comp);
      _this.tm = data.tm ? _PropertyFactory2.default.getProp(_this, data.tm, 0, globalData.frameRate, _this) : {
        _placeholder: true
      };
      return _this;
    }

    _createClass(CVCompElement, [{
      key: 'renderInnerContent',
      value: function renderInnerContent() {
        var i = void 0;
        var len = this.layers.length;
        for (i = len - 1; i >= 0; i -= 1) {
          if (this.completeLayers || this.elements[i]) {
            this.elements[i].renderFrame();
          }
        }
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        var i = void 0;
        var len = this.layers.length;
        for (i = len - 1; i >= 0; i -= 1) {
          if (this.elements[i]) {
            this.elements[i].destroy();
          }
        }
        this.layers = null;
        this.elements = null;
      }
    }]);

    return CVCompElement;
  }((0, _mixin2.default)(CanvasRenderer, _CompElement2.default, _CVBaseElement2.default));
  return CVCompElementClass;
};