'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mixin = require('../utils/mixin');

var _mixin2 = _interopRequireDefault(_mixin);

var _BaseElement = require('../elements/BaseElement');

var _BaseElement2 = _interopRequireDefault(_BaseElement);

var _TransformElement = require('../elements/TransformElement');

var _TransformElement2 = _interopRequireDefault(_TransformElement);

var _HierarchyElement = require('../elements/HierarchyElement');

var _HierarchyElement2 = _interopRequireDefault(_HierarchyElement);

var _FrameElement = require('../elements/FrameElement');

var _FrameElement2 = _interopRequireDefault(_FrameElement);

var _SVGBaseElement = require('../elements/SVGBaseElement');

var _SVGBaseElement2 = _interopRequireDefault(_SVGBaseElement);

var _RenderableDOMElement = require('../elements/RenderableDOMElement');

var _RenderableDOMElement2 = _interopRequireDefault(_RenderableDOMElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IImageElement = function (_Mixin) {
  _inherits(IImageElement, _Mixin);

  function IImageElement(data, globalData, comp) {
    _classCallCheck(this, IImageElement);

    var _this = _possibleConstructorReturn(this, (IImageElement.__proto__ || Object.getPrototypeOf(IImageElement)).call(this));

    _this.assetData = globalData.getAssetData(data.refId);
    _this.initElement(data, globalData, comp);
    return _this;
  }

  _createClass(IImageElement, [{
    key: 'createContent',
    value: function createContent() {
      console.warn('createContent');
    }
  }]);

  return IImageElement;
}((0, _mixin2.default)(_BaseElement2.default, _TransformElement2.default, _SVGBaseElement2.default, _HierarchyElement2.default, _FrameElement2.default, _RenderableDOMElement2.default));

exports.default = IImageElement;