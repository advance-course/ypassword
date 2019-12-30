'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _LetterProps = require('../utils/LetterProps');

var _LetterProps2 = _interopRequireDefault(_LetterProps);

var _TextProperty = require('../utils/text/TextProperty');

var _TextProperty2 = _interopRequireDefault(_TextProperty);

var _TextAnimatorProperty = require('../utils/text/TextAnimatorProperty');

var _TextAnimatorProperty2 = _interopRequireDefault(_TextAnimatorProperty);

var _buildShapeString = require('../shapes/buildShapeString');

var _buildShapeString2 = _interopRequireDefault(_buildShapeString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ITextElement = function () {
  function ITextElement() {
    _classCallCheck(this, ITextElement);

    this.emptyProp = new _LetterProps2.default();
  }

  _createClass(ITextElement, [{
    key: 'initElement',
    value: function initElement(data, globalData, comp) {
      this.lettersChangedFlag = true;
      this.initFrame();
      this.initBaseData(data, globalData, comp);
      this.textProperty = new _TextProperty2.default(this, data.t, this.dynamicProperties);
      this.textAnimator = new _TextAnimatorProperty2.default(data.t, this.renderType, this);
      this.initTransform(data, globalData, comp);
      this.initHierarchy();
      this.initRenderable();
      this.initRendererElement();
      this.createContainerElements();
      this.addMasks();
      this.createContent();
      this.hide();
      this.textAnimator.searchProperties(this.dynamicProperties);
    }
  }, {
    key: 'prepareFrame',
    value: function prepareFrame(num) {
      this._mdf = false;
      this.prepareRenderableFrame(num);
      this.prepareProperties(num, this.isInRange);
      if (this.textProperty._mdf || this.textProperty._isFirstFrame) {
        this.buildNewText();
        this.textProperty._isFirstFrame = false;
        this.textProperty._mdf = false;
      }
    }
  }, {
    key: 'createPathShape',
    value: function createPathShape(matrixHelper, shapes) {
      var j = void 0;
      var jLen = shapes.length;
      // let k;
      // let kLen;
      var pathNodes = void 0;
      var shapeStr = '';
      for (j = 0; j < jLen; j += 1) {
        pathNodes = shapes[j].ks.k;
        shapeStr += (0, _buildShapeString2.default)(pathNodes, pathNodes.i.length, true, matrixHelper);
      }
      return shapeStr;
    }
  }, {
    key: 'updateDocumentData',
    value: function updateDocumentData(newData, index) {
      this.textProperty.updateDocumentData(newData, index);
    }
  }, {
    key: 'canResizeFont',
    value: function canResizeFont(_canResize) {
      this.textProperty.canResizeFont(_canResize);
    }
  }, {
    key: 'setMinimumFontSize',
    value: function setMinimumFontSize(_fontSize) {
      this.textProperty.setMinimumFontSize(_fontSize);
    }
  }, {
    key: 'applyTextPropertiesToMatrix',
    value: function applyTextPropertiesToMatrix(documentData, matrixHelper, lineNumber, xPos, yPos) {
      if (documentData.ps) {
        matrixHelper.translate(documentData.ps[0], documentData.ps[1] + documentData.ascent, 0);
      }
      matrixHelper.translate(0, -documentData.ls, 0);
      switch (documentData.j) {
        case 1:
          matrixHelper.translate(documentData.justifyOffset + (documentData.boxWidth - documentData.lineWidths[lineNumber]), 0, 0);
          break;
        case 2:
          matrixHelper.translate(documentData.justifyOffset + (documentData.boxWidth - documentData.lineWidths[lineNumber]) / 2, 0, 0);
          break;
        default:
          break;
      }
      matrixHelper.translate(xPos, yPos, 0);
    }
  }, {
    key: 'buildColor',
    value: function buildColor(colorData) {
      return 'rgb(' + Math.round(colorData[0] * 255) + ',' + Math.round(colorData[1] * 255) + ',' + Math.round(colorData[2] * 255) + ')';
    }
  }, {
    key: 'destroy',
    value: function destroy() {}
  }]);

  return ITextElement;
}();

exports.default = ITextElement;