'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mixin = require('../utils/mixin');

var _mixin2 = _interopRequireDefault(_mixin);

var _BaseElement = require('./BaseElement');

var _BaseElement2 = _interopRequireDefault(_BaseElement);

var _TransformElement = require('./TransformElement');

var _TransformElement2 = _interopRequireDefault(_TransformElement);

var _HierarchyElement = require('./HierarchyElement');

var _HierarchyElement2 = _interopRequireDefault(_HierarchyElement);

var _FrameElement = require('./FrameElement');

var _FrameElement2 = _interopRequireDefault(_FrameElement);

var _RenderableDOMElement = require('./RenderableDOMElement');

var _RenderableDOMElement2 = _interopRequireDefault(_RenderableDOMElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ICompElement = function (_Mixin) {
  _inherits(ICompElement, _Mixin);

  function ICompElement() {
    _classCallCheck(this, ICompElement);

    return _possibleConstructorReturn(this, (ICompElement.__proto__ || Object.getPrototypeOf(ICompElement)).apply(this, arguments));
  }

  _createClass(ICompElement, [{
    key: 'initElement',
    value: function initElement(data, globalData, comp) {
      this.initFrame();
      this.initBaseData(data, globalData, comp);
      this.initTransform(data, globalData, comp);
      this.initRenderable();
      this.initHierarchy();
      this.initRendererElement();
      this.createContainerElements();
      this.addMasks();
      if (this.data.xt || !globalData.progressiveLoad) {
        this.buildAllItems();
      }
      this.hide();
    }
  }, {
    key: 'prepareFrame',
    value: function prepareFrame(num) {
      this._mdf = false;
      this.prepareRenderableFrame(num);
      this.prepareProperties(num, this.isInRange);
      if (!this.isInRange && !this.data.xt) {
        return;
      }

      if (!this.tm._placeholder) {
        var timeRemapped = this.tm.v;
        if (timeRemapped === this.data.op) {
          timeRemapped = this.data.op - 1;
        }
        this.renderedFrame = timeRemapped;
      } else {
        this.renderedFrame = num / this.data.sr;
      }
      var i = void 0;
      var len = this.elements.length;
      if (!this.completeLayers) {
        this.checkLayers(this.renderedFrame);
      }
      // This iteration needs to be backwards because of how expressions connect between each other
      for (i = len - 1; i >= 0; i -= 1) {
        if (this.completeLayers || this.elements[i]) {
          this.elements[i].prepareFrame(this.renderedFrame - this.layers[i].st);
          if (this.elements[i]._mdf) {
            this._mdf = true;
          }
        }
      }
    }
  }, {
    key: 'renderInnerContent',
    value: function renderInnerContent() {
      var i = void 0;
      var len = this.layers.length;
      for (i = 0; i < len; i += 1) {
        if (this.completeLayers || this.elements[i]) {
          this.elements[i].renderFrame();
        }
      }
    }
  }, {
    key: 'setElements',
    value: function setElements(elems) {
      this.elements = elems;
    }
  }, {
    key: 'getElements',
    value: function getElements() {
      return this.elements;
    }
  }, {
    key: 'destroyElements',
    value: function destroyElements() {
      var i = void 0;
      var len = this.layers.length;
      for (i = 0; i < len; i += 1) {
        if (this.elements[i]) {
          this.elements[i].destroy();
        }
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.destroyElements();
      this.destroyBaseElement();
    }
  }]);

  return ICompElement;
}((0, _mixin2.default)(_BaseElement2.default, _TransformElement2.default, _HierarchyElement2.default, _FrameElement2.default, _RenderableDOMElement2.default));

exports.default = ICompElement;