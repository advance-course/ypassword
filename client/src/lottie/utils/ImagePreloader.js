'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImagePreloader = function () {
  function ImagePreloader() {
    _classCallCheck(this, ImagePreloader);

    this.assetsPath = '';
    this.path = '';
    this.totalAssets = 0;
    this.totalImages = 0;
    this.loadedAssets = 0;
    this.imagesLoadedCb = null;
  }

  _createClass(ImagePreloader, [{
    key: 'imageLoaded',
    value: function imageLoaded() {
      this.loadedAssets += 1;
      if (this.loadedAssets === this.totalImages) {
        if (this.imagesLoadedCb) {
          this.imagesLoadedCb(null);
        }
      }
    }
  }, {
    key: 'getAssetsPath',
    value: function getAssetsPath(assetData) {
      var path = '';
      if (assetData.e) {
        path = assetData.p;
      } else if (this.assetsPath) {
        var imagePath = assetData.p;
        if (imagePath.indexOf('images/') !== -1) {
          imagePath = imagePath.split('/')[1];
        }
        path = this.assetsPath + imagePath;
      } else {
        path = this.path;
        path += assetData.u ? assetData.u : '';
        path += assetData.p;
      }
      return path;
    }
  }, {
    key: 'loadImage',
    value: function loadImage(path, cb) {
      var imageLoaded = this.imageLoaded.bind(this);
      wx.downloadFile({
        url: path,
        success: function success(res) {
          // 本地路径
          cb(res.tempFilePath);
          imageLoaded();
        },
        fail: function fail() {
          imageLoaded();
        }
      });
    }
  }, {
    key: 'loadAssets',
    value: function loadAssets(assets, cb) {
      this.imagesLoadedCb = cb;
      this.totalAssets = assets.length;
      var i = void 0;
      for (i = 0; i < this.totalAssets; i += 1) {
        if (!assets[i].layers) {
          this.loadImage(this.getAssetsPath(assets[i]), loadImageCB);
          this.totalImages += 1;
        }
      }
      function loadImageCB(tempFilePath) {
        assets[i] = tempFilePath;
      }
    }
  }, {
    key: 'setPath',
    value: function setPath(path) {
      this.path = path || '';
    }
  }, {
    key: 'setAssetsPath',
    value: function setAssetsPath(path) {
      this.assetsPath = path || '';
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.imagesLoadedCb = null;
    }
  }]);

  return ImagePreloader;
}();

exports.default = ImagePreloader;