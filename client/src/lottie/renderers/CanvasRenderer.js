'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transformationMatrix = require('../3rd_party/transformation-matrix');

var _transformationMatrix2 = _interopRequireDefault(_transformationMatrix);

var _CVCompElement = require('../canvasElements/CVCompElement');

var _CVCompElement2 = _interopRequireDefault(_CVCompElement);

var _CVContextData = require('../canvasElements/CVContextData');

var _CVContextData2 = _interopRequireDefault(_CVContextData);

var _CVImageElement = require('../canvasElements/CVImageElement');

var _CVImageElement2 = _interopRequireDefault(_CVImageElement);

var _CVShapeElement = require('../canvasElements/CVShapeElement');

var _CVShapeElement2 = _interopRequireDefault(_CVShapeElement);

var _CVSolidElement = require('../canvasElements/CVSolidElement');

var _CVSolidElement2 = _interopRequireDefault(_CVSolidElement);

var _CVTextElement = require('../canvasElements/CVTextElement');

var _CVTextElement2 = _interopRequireDefault(_CVTextElement);

var _NullElement = require('../elements/NullElement');

var _NullElement2 = _interopRequireDefault(_NullElement);

var _index = require('../utils/index');

var _BaseRenderer2 = require('./BaseRenderer');

var _BaseRenderer3 = _interopRequireDefault(_BaseRenderer2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CVCompElement = void 0;

var CanvasRenderer = function (_BaseRenderer) {
  _inherits(CanvasRenderer, _BaseRenderer);

  function CanvasRenderer(animationItem, config) {
    _classCallCheck(this, CanvasRenderer);

    var _this = _possibleConstructorReturn(this, (CanvasRenderer.__proto__ || Object.getPrototypeOf(CanvasRenderer)).call(this));

    _this.animationItem = animationItem;
    _this.renderConfig = {
      clearCanvas: config && config.clearCanvas !== undefined ? config.clearCanvas : true,
      context: config && config.context || null,
      progressiveLoad: config && config.progressiveLoad || false,
      preserveAspectRatio: config && config.preserveAspectRatio || 'xMidYMid meet',
      className: config && config.className || ''
    };
    _this.renderConfig.dpr = config && config.dpr || 1;
    _this.renderedFrame = -1;
    _this.globalData = {
      frameNum: -1,
      _mdf: false,
      renderConfig: _this.renderConfig,
      currentGlobalAlpha: -1
    };
    _this.contextData = new _CVContextData2.default();
    _this.elements = [];
    _this.pendingElements = [];
    _this.transformMat = new _transformationMatrix2.default();
    _this.completeLayers = false;
    return _this;
  }

  _createClass(CanvasRenderer, [{
    key: 'createShape',
    value: function createShape(data) {
      return new _CVShapeElement2.default(data, this.globalData, this);
    }
  }, {
    key: 'createText',
    value: function createText(data) {
      return new _CVTextElement2.default(data, this.globalData, this);
    }
  }, {
    key: 'createImage',
    value: function createImage(data) {
      return new _CVImageElement2.default(data, this.globalData, this);
    }
  }, {
    key: 'createComp',
    value: function createComp(data) {
      return new CVCompElement(data, this.globalData, this);
    }
  }, {
    key: 'createSolid',
    value: function createSolid(data) {
      return new _CVSolidElement2.default(data, this.globalData, this);
    }
  }, {
    key: 'createNull',
    value: function createNull(data) {
      return new _NullElement2.default(data, this.globalData, this);
    }
  }, {
    key: 'ctxTransform',
    value: function ctxTransform(props) {
      if (props[0] === 1 && props[1] === 0 && props[4] === 0 && props[5] === 1 && props[12] === 0 && props[13] === 0) {
        return;
      }
      if (!this.renderConfig.clearCanvas) {
        // this.canvasContext.setTransform(props[0], props[1], props[4], props[5], props[12], props[13]);

        this.canvasContext.transform(props[0], props[1], props[4], props[5], props[12], props[13]);
        return;
      }
      this.transformMat.cloneFromProps(props);
      var cProps = this.contextData.cTr.props;
      this.transformMat.transform(cProps[0], cProps[1], cProps[2], cProps[3], cProps[4], cProps[5], cProps[6], cProps[7], cProps[8], cProps[9], cProps[10], cProps[11], cProps[12], cProps[13], cProps[14], cProps[15]);
      this.contextData.cTr.cloneFromProps(this.transformMat.props);
      var trProps = this.contextData.cTr.props;
      this.canvasContext.setTransform(trProps[0], trProps[1], trProps[4], trProps[5], trProps[12], trProps[13]);
    }
  }, {
    key: 'ctxOpacity',
    value: function ctxOpacity(op) {
      /* if(op === 1){
          return;
      } */
      if (!this.renderConfig.clearCanvas) {
        var globalAlpha = this.canvasContext.globalAlpha * (op < 0 ? 0 : op);
        this.canvasContext.globalAlpha = globalAlpha;
        this.canvasContext.setGlobalAlpha(globalAlpha);
        this.globalData.currentGlobalAlpha = this.contextData.cO;
        return;
      }
      this.contextData.cO *= op < 0 ? 0 : op;
      if (this.globalData.currentGlobalAlpha !== this.contextData.cO) {
        this.canvasContext.globalAlpha = this.contextData.cO;
        this.canvasContext.setGlobalAlpha(this.contextData.cO);
        this.globalData.currentGlobalAlpha = this.contextData.cO;
      }
    }
  }, {
    key: 'reset',
    value: function reset() {
      if (!this.renderConfig.clearCanvas) {
        this.canvasContext.restore();
        return;
      }
      this.contextData.reset();
    }
  }, {
    key: 'save',
    value: function save(actionFlag) {
      if (!this.renderConfig.clearCanvas) {
        this.canvasContext.save();
        return;
      }
      if (actionFlag) {
        this.canvasContext.save();
      }
      var props = this.contextData.cTr.props;
      if (this.contextData._length <= this.contextData.cArrPos) {
        this.contextData.duplicate();
      }
      var i = void 0;
      var arr = this.contextData.saved[this.contextData.cArrPos];
      for (i = 0; i < 16; i += 1) {
        arr[i] = props[i];
      }
      this.contextData.savedOp[this.contextData.cArrPos] = this.contextData.cO;
      this.contextData.cArrPos += 1;
    }
  }, {
    key: 'restore',
    value: function restore(actionFlag) {
      if (!this.renderConfig.clearCanvas) {
        this.canvasContext.restore();
        return;
      }
      if (actionFlag) {
        this.canvasContext.restore();
        this.globalData.blendMode = 'source-over';
      }
      this.contextData.cArrPos -= 1;
      var popped = this.contextData.saved[this.contextData.cArrPos];
      var i = void 0;
      var arr = this.contextData.cTr.props;
      for (i = 0; i < 16; i += 1) {
        arr[i] = popped[i];
      }
      this.canvasContext.setTransform(popped[0], popped[1], popped[4], popped[5], popped[12], popped[13]);
      popped = this.contextData.savedOp[this.contextData.cArrPos];
      this.contextData.cO = popped;
      if (this.globalData.currentGlobalAlpha !== popped) {
        this.canvasContext.globalAlpha = popped;
        this.canvasContext.setGlobalAlpha(popped);
        this.globalData.currentGlobalAlpha = popped;
      }
    }
  }, {
    key: 'configAnimation',
    value: function configAnimation(animData) {
      this.canvasContext = this.renderConfig.context;
      this.data = animData;
      this.layers = animData.layers;
      this.transformCanvas = {
        w: animData.w,
        h: animData.h,
        sx: 0,
        sy: 0,
        tx: 0,
        ty: 0
      };
      this.setupGlobalData(animData /* , document.body */);
      this.globalData.canvasContext = this.canvasContext;
      this.globalData.renderer = this;
      this.globalData.isDashed = false;
      this.globalData.progressiveLoad = this.renderConfig.progressiveLoad;
      this.globalData.transformCanvas = this.transformCanvas;
      this.elements = (0, _index.createSizedArray)(animData.layers.length);

      this.updateContainerSize();
    }
  }, {
    key: 'updateContainerSize',
    value: function updateContainerSize() {
      this.reset();
      var elementWidth = void 0;
      var elementHeight = void 0;

      elementWidth = this.canvasContext.canvas.width * this.renderConfig.dpr;
      elementHeight = this.canvasContext.canvas.height * this.renderConfig.dpr;

      var elementRel = void 0;
      var animationRel = void 0;
      if (this.renderConfig.preserveAspectRatio.indexOf('meet') !== -1 || this.renderConfig.preserveAspectRatio.indexOf('slice') !== -1) {
        var par = this.renderConfig.preserveAspectRatio.split(' ');
        var fillType = par[1] || 'meet';
        var pos = par[0] || 'xMidYMid';
        var xPos = pos.substr(0, 4);
        var yPos = pos.substr(4);
        elementRel = elementWidth / elementHeight;
        animationRel = this.transformCanvas.w / this.transformCanvas.h;
        if (animationRel > elementRel && fillType === 'meet' || animationRel < elementRel && fillType === 'slice') {
          this.transformCanvas.sx = elementWidth / (this.transformCanvas.w / this.renderConfig.dpr);
          this.transformCanvas.sy = elementWidth / (this.transformCanvas.w / this.renderConfig.dpr);
        } else {
          this.transformCanvas.sx = elementHeight / (this.transformCanvas.h / this.renderConfig.dpr);
          this.transformCanvas.sy = elementHeight / (this.transformCanvas.h / this.renderConfig.dpr);
        }

        if (xPos === 'xMid' && (animationRel < elementRel && fillType === 'meet' || animationRel > elementRel && fillType === 'slice')) {
          this.transformCanvas.tx = (elementWidth - this.transformCanvas.w * (elementHeight / this.transformCanvas.h)) / 2 * this.renderConfig.dpr;
        } else if (xPos === 'xMax' && (animationRel < elementRel && fillType === 'meet' || animationRel > elementRel && fillType === 'slice')) {
          this.transformCanvas.tx = (elementWidth - this.transformCanvas.w * (elementHeight / this.transformCanvas.h)) * this.renderConfig.dpr;
        } else {
          this.transformCanvas.tx = 0;
        }
        if (yPos === 'YMid' && (animationRel > elementRel && fillType === 'meet' || animationRel < elementRel && fillType === 'slice')) {
          this.transformCanvas.ty = (elementHeight - this.transformCanvas.h * (elementWidth / this.transformCanvas.w)) / 2 * this.renderConfig.dpr;
        } else if (yPos === 'YMax' && (animationRel > elementRel && fillType === 'meet' || animationRel < elementRel && fillType === 'slice')) {
          this.transformCanvas.ty = (elementHeight - this.transformCanvas.h * (elementWidth / this.transformCanvas.w)) * this.renderConfig.dpr;
        } else {
          this.transformCanvas.ty = 0;
        }
      } else if (this.renderConfig.preserveAspectRatio === 'none') {
        this.transformCanvas.sx = elementWidth / (this.transformCanvas.w / this.renderConfig.dpr);
        this.transformCanvas.sy = elementHeight / (this.transformCanvas.h / this.renderConfig.dpr);
        this.transformCanvas.tx = 0;
        this.transformCanvas.ty = 0;
      } else {
        this.transformCanvas.sx = this.renderConfig.dpr;
        this.transformCanvas.sy = this.renderConfig.dpr;
        this.transformCanvas.tx = 0;
        this.transformCanvas.ty = 0;
      }
      this.transformCanvas.props = [this.transformCanvas.sx, 0, 0, 0, 0, this.transformCanvas.sy, 0, 0, 0, 0, 1, 0, this.transformCanvas.tx, this.transformCanvas.ty, 0, 1];
      /* let i, len = this.elements.length;
      for(i=0;i<len;i+=1){
          if(this.elements[i] && this.elements[i].data.ty === 0){
              this.elements[i].resize(this.globalData.transformCanvas);
          }
      } */
      this.ctxTransform(this.transformCanvas.props);
      this.canvasContext.beginPath();
      this.canvasContext.rect(0, 0, this.transformCanvas.w, this.transformCanvas.h);
      this.canvasContext.closePath();
      this.canvasContext.clip();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var i = void 0;
      var len = this.layers ? this.layers.length : 0;
      for (i = len - 1; i >= 0; i -= 1) {
        if (this.elements[i]) {
          this.elements[i].destroy();
        }
      }
      this.elements.length = 0;
      this.globalData.canvasContext = null;
      this.animationItem.container = null;
      this.destroyed = true;
    }
  }, {
    key: 'renderFrame',
    value: function renderFrame(num) {
      if (this.renderedFrame === num && this.renderConfig.clearCanvas === true || this.destroyed || num === -1) {
        return;
      }

      this.renderedFrame = num;
      this.globalData.frameNum = num - this.animationItem._isFirstFrame;
      this.globalData.frameId += 1;
      this.globalData._mdf = !this.renderConfig.clearCanvas;
      this.globalData.projectInterface.currentFrame = num;

      var i = void 0;
      var len = this.layers.length;
      if (!this.completeLayers) {
        this.checkLayers(num);
      }
      for (i = 0; i < len; i++) {
        if (this.completeLayers || this.elements[i]) {
          this.elements[i].prepareFrame(num - this.layers[i].st);
        }
      }
      if (this.globalData._mdf) {
        if (this.renderConfig.clearCanvas === true) {
          this.canvasContext.clearRect(0, 0, this.transformCanvas.w, this.transformCanvas.h);
        } else {
          this.save();
        }
        for (i = len - 1; i >= 0; i -= 1) {
          if (this.completeLayers || this.elements[i]) {
            this.elements[i].renderFrame();
          }
        }
        this.canvasContext.draw();
        if (this.renderConfig.clearCanvas !== true) {
          this.restore();
        }
      }
    }
  }, {
    key: 'buildItem',
    value: function buildItem(pos) {
      var elements = this.elements;
      if (elements[pos] || this.layers[pos].ty === 99) {
        return;
      }
      var element = this.createItem(this.layers[pos], this, this.globalData);
      elements[pos] = element;
      element.initExpressions();
    }
  }, {
    key: 'checkPendingElements',
    value: function checkPendingElements() {
      while (this.pendingElements.length) {
        var element = this.pendingElements.pop();
        element.checkParenting();
      }
    }
  }, {
    key: 'hide',
    value: function hide() {
      // this.animationItem.container.style.display = 'none';
    }
  }, {
    key: 'show',
    value: function show() {
      // this.animationItem.container.style.display = 'block';
    }
  }]);

  return CanvasRenderer;
}(_BaseRenderer3.default);

CVCompElement = (0, _CVCompElement2.default)(CanvasRenderer);

exports.default = CanvasRenderer;