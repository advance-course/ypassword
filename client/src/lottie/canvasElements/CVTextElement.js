'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mixin = require('../utils/mixin');

var _mixin2 = _interopRequireDefault(_mixin);

var _CVBaseElement = require('../canvasElements/CVBaseElement');

var _CVBaseElement2 = _interopRequireDefault(_CVBaseElement);

var _BaseElement = require('../elements/BaseElement');

var _BaseElement2 = _interopRequireDefault(_BaseElement);

var _TransformElement = require('../elements/TransformElement');

var _TransformElement2 = _interopRequireDefault(_TransformElement);

var _HierarchyElement = require('../elements/HierarchyElement');

var _HierarchyElement2 = _interopRequireDefault(_HierarchyElement);

var _FrameElement = require('../elements/FrameElement');

var _FrameElement2 = _interopRequireDefault(_FrameElement);

var _RenderableElement = require('../elements/RenderableElement');

var _RenderableElement2 = _interopRequireDefault(_RenderableElement);

var _TextElement = require('../elements/TextElement');

var _TextElement2 = _interopRequireDefault(_TextElement);

var _index = require('../utils/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CVTextElement = function (_Mixin) {
  _inherits(CVTextElement, _Mixin);

  function CVTextElement(data, globalData, comp) {
    _classCallCheck(this, CVTextElement);

    var _this = _possibleConstructorReturn(this, (CVTextElement.__proto__ || Object.getPrototypeOf(CVTextElement)).call(this));

    _this.tHelper = (0, _index.createTag)('canvas');

    _this.textSpans = [];
    _this.yOffset = 0;
    _this.fillColorAnim = false;
    _this.strokeColorAnim = false;
    _this.strokeWidthAnim = false;
    _this.stroke = false;
    _this.fill = false;
    _this.justifyOffset = 0;
    _this.currentRender = null;
    _this.renderType = 'canvas';
    _this.values = {
      fill: 'rgba(0,0,0,0)',
      stroke: 'rgba(0,0,0,0)',
      sWidth: 0,
      fValue: ''
    };
    _this.initElement(data, globalData, comp);
    return _this;
  }

  _createClass(CVTextElement, [{
    key: 'buildNewText',
    value: function buildNewText() {
      var documentData = this.textProperty.currentData;
      this.renderedLetters = (0, _index.createSizedArray)(documentData.l ? documentData.l.length : 0);

      var hasFill = false;
      if (documentData.fc) {
        hasFill = true;
        this.values.fill = this.buildColor(documentData.fc);
      } else {
        this.values.fill = 'rgba(0,0,0,0)';
      }
      this.fill = hasFill;
      var hasStroke = false;
      if (documentData.sc) {
        hasStroke = true;
        this.values.stroke = this.buildColor(documentData.sc);
        this.values.sWidth = documentData.sw;
      }
      var fontData = this.globalData.fontManager.getFontByName(documentData.f);
      var i = void 0;
      var len = void 0;
      var letters = documentData.l;
      var matrixHelper = this.mHelper;
      this.stroke = hasStroke;
      this.values.fValue = documentData.finalSize + 'px ' + this.globalData.fontManager.getFontByName(documentData.f).fFamily;
      len = documentData.finalText.length;
      // this.tHelper.font = this.values.fValue;
      var charData = void 0;
      var shapeData = void 0;
      var k = void 0;
      var kLen = void 0;
      var shapes = void 0;
      var j = void 0;
      var jLen = void 0;
      var pathNodes = void 0;
      var commands = void 0;
      var pathArr = void 0;
      var singleShape = this.data.singleShape;
      var trackingOffset = documentData.tr / 1000 * documentData.finalSize;
      var xPos = 0;
      var yPos = 0;
      var firstLine = true;
      var cnt = 0;
      for (i = 0; i < len; i += 1) {
        charData = this.globalData.fontManager.getCharData(documentData.finalText[i], fontData.fStyle, this.globalData.fontManager.getFontByName(documentData.f).fFamily);
        shapeData = charData && charData.data || {};
        matrixHelper.reset();
        if (singleShape && letters[i].n) {
          xPos = -trackingOffset;
          yPos += documentData.yOffset;
          yPos += firstLine ? 1 : 0;
          firstLine = false;
        }

        shapes = shapeData.shapes ? shapeData.shapes[0].it : [];
        jLen = shapes.length;
        matrixHelper.scale(documentData.finalSize / 100, documentData.finalSize / 100);
        if (singleShape) {
          this.applyTextPropertiesToMatrix(documentData, matrixHelper, letters[i].line, xPos, yPos);
        }
        commands = (0, _index.createSizedArray)(jLen);
        for (j = 0; j < jLen; j += 1) {
          kLen = shapes[j].ks.k.i.length;
          pathNodes = shapes[j].ks.k;
          pathArr = [];
          for (k = 1; k < kLen; k += 1) {
            if (k === 1) {
              pathArr.push(matrixHelper.applyToX(pathNodes.v[0][0], pathNodes.v[0][1], 0), matrixHelper.applyToY(pathNodes.v[0][0], pathNodes.v[0][1], 0));
            }
            pathArr.push(matrixHelper.applyToX(pathNodes.o[k - 1][0], pathNodes.o[k - 1][1], 0), matrixHelper.applyToY(pathNodes.o[k - 1][0], pathNodes.o[k - 1][1], 0), matrixHelper.applyToX(pathNodes.i[k][0], pathNodes.i[k][1], 0), matrixHelper.applyToY(pathNodes.i[k][0], pathNodes.i[k][1], 0), matrixHelper.applyToX(pathNodes.v[k][0], pathNodes.v[k][1], 0), matrixHelper.applyToY(pathNodes.v[k][0], pathNodes.v[k][1], 0));
          }
          pathArr.push(matrixHelper.applyToX(pathNodes.o[k - 1][0], pathNodes.o[k - 1][1], 0), matrixHelper.applyToY(pathNodes.o[k - 1][0], pathNodes.o[k - 1][1], 0), matrixHelper.applyToX(pathNodes.i[0][0], pathNodes.i[0][1], 0), matrixHelper.applyToY(pathNodes.i[0][0], pathNodes.i[0][1], 0), matrixHelper.applyToX(pathNodes.v[0][0], pathNodes.v[0][1], 0), matrixHelper.applyToY(pathNodes.v[0][0], pathNodes.v[0][1], 0));
          commands[j] = pathArr;
        }
        if (singleShape) {
          xPos += letters[i].l;
          xPos += trackingOffset;
        }
        if (this.textSpans[cnt]) {
          this.textSpans[cnt].elem = commands;
        } else {
          this.textSpans[cnt] = {
            elem: commands
          };
        }
        cnt += 1;
      }
    }
  }, {
    key: 'renderInnerContent',
    value: function renderInnerContent() {
      var ctx = this.canvasContext;
      // let finalMat = this.finalTransform.mat.props;
      ctx.font = this.values.fValue;
      ctx.setLineCap('butt');
      ctx.setLineJoin('miter');
      ctx.setMiterLimit(4);

      if (!this.data.singleShape) {
        this.textAnimator.getMeasures(this.textProperty.currentData, this.lettersChangedFlag);
      }

      var i = void 0;
      var len = void 0;
      var j = void 0;
      var jLen = void 0;
      var k = void 0;
      var kLen = void 0;
      var renderedLetters = this.textAnimator.renderedLetters;

      var letters = this.textProperty.currentData.l;

      len = letters.length;
      var renderedLetter = void 0;
      var lastFill = null;
      var lastStroke = null;
      var lastStrokeW = null;
      var commands = void 0;
      var pathArr = void 0;
      for (i = 0; i < len; i += 1) {
        if (letters[i].n) {
          continue;
        }
        renderedLetter = renderedLetters[i];
        if (renderedLetter) {
          this.globalData.renderer.save();
          this.globalData.renderer.ctxTransform(renderedLetter.p);
          this.globalData.renderer.ctxOpacity(renderedLetter.o);
        }
        if (this.fill) {
          if (renderedLetter && renderedLetter.fc) {
            if (lastFill !== renderedLetter.fc) {
              lastFill = renderedLetter.fc;
              ctx.setFillStyle(renderedLetter.fc);
            }
          } else if (lastFill !== this.values.fill) {
            lastFill = this.values.fill;
            ctx.setFillStyle(this.values.fill);
          }
          commands = this.textSpans[i].elem;
          jLen = commands.length;
          this.globalData.canvasContext.beginPath();
          for (j = 0; j < jLen; j += 1) {
            pathArr = commands[j];
            kLen = pathArr.length;
            this.globalData.canvasContext.moveTo(pathArr[0], pathArr[1]);
            for (k = 2; k < kLen; k += 6) {
              this.globalData.canvasContext.bezierCurveTo(pathArr[k], pathArr[k + 1], pathArr[k + 2], pathArr[k + 3], pathArr[k + 4], pathArr[k + 5]);
            }
          }
          this.globalData.canvasContext.closePath();
          this.globalData.canvasContext.fill();
          // /ctx.fillText(this.textSpans[i].val,0,0);
        }
        if (this.stroke) {
          if (renderedLetter && renderedLetter.sw) {
            if (lastStrokeW !== renderedLetter.sw) {
              lastStrokeW = renderedLetter.sw;
              ctx.setLineWidth(renderedLetter.sw);
            }
          } else if (lastStrokeW !== this.values.sWidth) {
            lastStrokeW = this.values.sWidth;
            ctx.setLineWidth(this.values.sWidth);
          }
          if (renderedLetter && renderedLetter.sc) {
            if (lastStroke !== renderedLetter.sc) {
              lastStroke = renderedLetter.sc;
              ctx.setStrokeStyle(renderedLetter.sc);
            }
          } else if (lastStroke !== this.values.stroke) {
            lastStroke = this.values.stroke;
            ctx.setStrokeStyle(this.values.stroke);
          }
          commands = this.textSpans[i].elem;
          jLen = commands.length;
          this.globalData.canvasContext.beginPath();
          for (j = 0; j < jLen; j += 1) {
            pathArr = commands[j];
            kLen = pathArr.length;
            this.globalData.canvasContext.moveTo(pathArr[0], pathArr[1]);
            for (k = 2; k < kLen; k += 6) {
              this.globalData.canvasContext.bezierCurveTo(pathArr[k], pathArr[k + 1], pathArr[k + 2], pathArr[k + 3], pathArr[k + 4], pathArr[k + 5]);
            }
          }
          this.globalData.canvasContext.closePath();
          this.globalData.canvasContext.stroke();
          // /ctx.strokeText(letters[i].val,0,0);
        }
        if (renderedLetter) {
          this.globalData.renderer.restore();
        }
        // ctx.draw(true);
      }
      /* if(this.data.hasMask){
       this.globalData.renderer.restore(true);
       } */
    }
  }]);

  return CVTextElement;
}((0, _mixin2.default)(_BaseElement2.default, _TransformElement2.default, _CVBaseElement2.default, _HierarchyElement2.default, _FrameElement2.default, _RenderableElement2.default, _TextElement2.default));

exports.default = CVTextElement;