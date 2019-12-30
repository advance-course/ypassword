'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transformationMatrix = require('../3rd_party/transformation-matrix');

var _transformationMatrix2 = _interopRequireDefault(_transformationMatrix);

var _CVEffects = require('./CVEffects');

var _CVEffects2 = _interopRequireDefault(_CVEffects);

var _CVMaskElement = require('./CVMaskElement');

var _CVMaskElement2 = _interopRequireDefault(_CVMaskElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CVBaseElement = function () {
  function CVBaseElement() {
    _classCallCheck(this, CVBaseElement);

    this.mHelper = new _transformationMatrix2.default();
  }

  _createClass(CVBaseElement, [{
    key: 'createElements',
    value: function createElements() {}
  }, {
    key: 'initRendererElement',
    value: function initRendererElement() {}
  }, {
    key: 'createContainerElements',
    value: function createContainerElements() {
      this.canvasContext = this.globalData.canvasContext;
      this.renderableEffectsManager = new _CVEffects2.default(this);
    }
  }, {
    key: 'createContent',
    value: function createContent() {}
  }, {
    key: 'setBlendMode',
    value: function setBlendMode() {
      var globalData = this.globalData;
      if (globalData.blendMode !== this.data.bm) {
        globalData.blendMode = this.data.bm;
        var blendModeValue = this.getBlendMode();
        globalData.canvasContext.globalCompositeOperation = blendModeValue;
      }
    }
  }, {
    key: 'addMasks',
    value: function addMasks() {
      this.maskManager = new _CVMaskElement2.default(this.data, this);
    }
  }, {
    key: 'hideElement',
    value: function hideElement() {
      if (!this.hidden && (!this.isInRange || this.isTransparent)) {
        this.hidden = true;
      }
    }
  }, {
    key: 'showElement',
    value: function showElement() {
      if (this.isInRange && !this.isTransparent) {
        this.hidden = false;
        this._isFirstFrame = true;
        this.maskManager._isFirstFrame = true;
      }
    }
  }, {
    key: 'renderFrame',
    value: function renderFrame() {
      if (this.hidden || this.data.hd) {
        return;
      }
      this.renderTransform();
      this.renderRenderable();
      this.setBlendMode();
      this.globalData.renderer.save();
      this.globalData.renderer.ctxTransform(this.finalTransform.mat.props);
      this.globalData.renderer.ctxOpacity(this.finalTransform.mProp.o.v);
      this.renderInnerContent();
      this.globalData.renderer.restore();
      if (this.maskManager.hasMasks) {
        this.globalData.renderer.restore(true);
      }
      if (this._isFirstFrame) {
        this._isFirstFrame = false;
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.canvasContext = null;
      this.data = null;
      this.globalData = null;
      this.maskManager.destroy();
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.hideElement();
    }
  }, {
    key: 'show',
    value: function show() {
      this.showElement();
    }
  }]);

  return CVBaseElement;
}();

exports.default = CVBaseElement;