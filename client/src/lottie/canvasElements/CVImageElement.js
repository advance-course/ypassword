'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ImageElement = require('../elements/ImageElement');

var _ImageElement2 = _interopRequireDefault(_ImageElement);

var _index = require('../utils/index');

var _mixin = require('../utils/mixin');

var _mixin2 = _interopRequireDefault(_mixin);

var _CVBaseElement = require('../canvasElements/CVBaseElement');

var _CVBaseElement2 = _interopRequireDefault(_CVBaseElement);

var _BaseElement = require('../elements/BaseElement');

var _BaseElement2 = _interopRequireDefault(_BaseElement);

var _HierarchyElement = require('../elements/HierarchyElement');

var _HierarchyElement2 = _interopRequireDefault(_HierarchyElement);

var _FrameElement = require('../elements/FrameElement');

var _FrameElement2 = _interopRequireDefault(_FrameElement);

var _RenderableElement = require('../elements/RenderableElement');

var _RenderableElement2 = _interopRequireDefault(_RenderableElement);

var _TransformElement = require('../elements/TransformElement');

var _TransformElement2 = _interopRequireDefault(_TransformElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CVImageElement = function (_Mixin) {
  _inherits(CVImageElement, _Mixin);

  function CVImageElement(data, globalData, comp) {
    _classCallCheck(this, CVImageElement);

    var _this = _possibleConstructorReturn(this, (CVImageElement.__proto__ || Object.getPrototypeOf(CVImageElement)).call(this));

    _this.prepareFrame = _ImageElement2.default.prototype.prepareFrame;

    _this.failed = false;
    _this.img = {};
    _this.assetData = globalData.getAssetData(data.refId);
    _this.initElement(data, globalData, comp);
    _this.globalData.addPendingElement();
    return _this;
  }

  _createClass(CVImageElement, [{
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
    key: 'imageLoaded',
    value: function imageLoaded() {
      this.globalData.elementLoaded();
      // 压缩图片比例
      if (this.assetData.w !== this.img.width || this.assetData.h !== this.img.height) {
        var canvas = (0, _index.createTag)('canvas');
        canvas.width = this.assetData.w;
        canvas.height = this.assetData.h;
        var ctx = canvas.getContext('2d');

        var imgW = this.img.width;
        var imgH = this.img.height;
        var imgRel = imgW / imgH;
        var canvasRel = this.assetData.w / this.assetData.h;
        var widthCrop = void 0;
        var heightCrop = void 0;
        if (imgRel > canvasRel) {
          heightCrop = imgH;
          widthCrop = heightCrop * canvasRel;
        } else {
          widthCrop = imgW;
          heightCrop = widthCrop / canvasRel;
        }
        ctx.drawImage(this.img, (imgW - widthCrop) / 2, (imgH - heightCrop) / 2, widthCrop, heightCrop, 0, 0, this.assetData.w, this.assetData.h);
        this.img = canvas;
      }
    }
  }, {
    key: 'imageFailed',
    value: function imageFailed() {
      this.failed = true;
      this.globalData.elementLoaded();
    }
  }, {
    key: 'createContent',
    value: function createContent() {
      var _this2 = this;

      var assetPath = this.globalData.getAssetsPath(this.assetData);
      wx.downloadFile({
        url: assetPath,
        success: function success(res) {
          wx.getImageInfo({
            src: res.tempFilePath,
            success: function success(_ref) {
              var width = _ref.width,
                  height = _ref.height;

              _this2.img.src = res.tempFilePath;
              _this2.img.width = width;
              _this2.img.height = height;
              _this2.imageLoaded();
            }
          });
        },
        fail: function fail() {
          _this2.imageFailed();
        }
      });
    }
  }, {
    key: 'renderInnerContent',
    value: function renderInnerContent() {
      if (this.failed) {
        return;
      }
      this.canvasContext.drawImage(this.img.src, 0, 0);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.img = null;
    }
  }]);

  return CVImageElement;
}((0, _mixin2.default)(_BaseElement2.default, _TransformElement2.default, _CVBaseElement2.default, _HierarchyElement2.default, _FrameElement2.default, _RenderableElement2.default));

exports.default = CVImageElement;