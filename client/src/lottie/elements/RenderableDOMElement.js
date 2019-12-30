'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RenderableElement2 = require('./RenderableElement');

var _RenderableElement3 = _interopRequireDefault(_RenderableElement2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RenderableDOMElement = function (_RenderableElement) {
  _inherits(RenderableDOMElement, _RenderableElement);

  function RenderableDOMElement() {
    _classCallCheck(this, RenderableDOMElement);

    return _possibleConstructorReturn(this, (RenderableDOMElement.__proto__ || Object.getPrototypeOf(RenderableDOMElement)).apply(this, arguments));
  }

  _createClass(RenderableDOMElement, [{
    key: 'initElement',
    value: function initElement(data, globalData, comp) {
      this.initFrame();
      this.initBaseData(data, globalData, comp);
      this.initTransform(data, globalData, comp);
      this.initHierarchy();
      this.initRenderable();
      this.initRendererElement();
      this.createContainerElements();
      this.addMasks();
      this.createContent();
      this.hide();
    }
  }, {
    key: 'hide',
    value: function hide() {}
  }, {
    key: 'show',
    value: function show() {}
  }, {
    key: 'renderFrame',
    value: function renderFrame() {
      // If it is exported as hidden (data.hd === true) no need to render
      // If it is not visible no need to render
      if (this.data.hd || this.hidden) {
        return;
      }
      this.renderTransform();
      this.renderRenderable();
      this.renderElement();
      this.renderInnerContent();
      if (this._isFirstFrame) {
        this._isFirstFrame = false;
      }
    }
  }, {
    key: 'renderInnerContent',
    value: function renderInnerContent() {}
  }, {
    key: 'prepareFrame',
    value: function prepareFrame(num) {
      this._mdf = false;
      this.prepareRenderableFrame(num);
      this.prepareProperties(num, this.isInRange);
      this.checkTransparency();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.innerElem = null;
      this.destroyBaseElement();
    }
  }]);

  return RenderableDOMElement;
}(_RenderableElement3.default);

exports.default = RenderableDOMElement;