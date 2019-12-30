'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CanvasRenderer = require('../renderers/CanvasRenderer');

var _CanvasRenderer2 = _interopRequireDefault(_CanvasRenderer);

var _assetLoader = require('../utils/assetLoader');

var _assetLoader2 = _interopRequireDefault(_assetLoader);

var _BaseEvent2 = require('../utils/BaseEvent');

var _BaseEvent3 = _interopRequireDefault(_BaseEvent2);

var _common = require('../utils/common');

var _DataManager = require('../utils/DataManager');

var _DataManager2 = _interopRequireDefault(_DataManager);

var _Expressions = require('../utils/expressions/Expressions');

var _Expressions2 = _interopRequireDefault(_Expressions);

var _ImagePreloader = require('../utils/ImagePreloader');

var _ImagePreloader2 = _interopRequireDefault(_ImagePreloader);

var _index = require('../utils/index');

var _ProjectInterface = require('../utils/ProjectInterface');

var _ProjectInterface2 = _interopRequireDefault(_ProjectInterface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AnimationItem = function (_BaseEvent) {
  _inherits(AnimationItem, _BaseEvent);

  function AnimationItem() {
    _classCallCheck(this, AnimationItem);

    var _this = _possibleConstructorReturn(this, (AnimationItem.__proto__ || Object.getPrototypeOf(AnimationItem)).call(this));

    _this._cbs = [];
    _this.name = '';
    _this.path = '';
    _this.isLoaded = false;
    _this.currentFrame = 0;
    _this.currentRawFrame = 0;
    _this.totalFrames = 0;
    _this.frameRate = 0;
    _this.frameMult = 0;
    _this.playSpeed = 1;
    _this.playDirection = 1;
    _this.pendingElements = 0;
    _this.playCount = 0;
    _this.animationData = {};
    _this.assets = [];
    _this.isPaused = true;
    _this.autoplay = false;
    _this.loop = true;
    _this.renderer = null;
    _this.animationID = (0, _index.randomString)(10);
    _this.assetsPath = '';
    _this.timeCompleted = 0;
    _this.segmentPos = 0;
    _this.subframeEnabled = _index.subframeEnabled;
    _this.segments = [];
    _this._idle = true;
    _this.projectInterface = (0, _ProjectInterface2.default)();
    return _this;
  }

  _createClass(AnimationItem, [{
    key: 'setParams',
    value: function setParams(params) {
      var _this2 = this;

      if (params.context) {
        this.context = params.context;
      }

      if (params.wrapper || params.container) {
        this.wrapper = params.wrapper || params.container;
      }

      this.renderer = new _CanvasRenderer2.default(this, params.rendererSettings);
      this.renderer.setProjectInterface(this.projectInterface);
      this.animType = 'canvas';

      if (params.loop === '' || params.loop === null) {
        this.loop = false;
      } else if (params.loop === false) {
        this.loop = false;
      } else if (params.loop === true) {
        this.loop = true;
      } else {
        this.loop = parseInt(params.loop, 10);
      }
      this.autoplay = 'autoplay' in params ? params.autoplay : true;
      this.name = params.name ? params.name : '';
      this.autoloadSegments = params.autoloadSegments ? params.autoloadSegments : true;
      this.assetsPath = params.assetsPath;
      if (params.animationData) {
        this.configAnimation(params.animationData);
      } else if (params.path) {
        var path = params.path;
        this.path = path;
        this.fileName = path.substr(params.path.lastIndexOf('/') + 1);

        _assetLoader2.default.load.call(this, path, this.configAnimation.bind(this));
      }

      // 判断是否在可视区域内
      if (wx.createIntersectionObserver) {
        var canvasId = params.rendererSettings.context.canvasId;
        var observer = wx.createIntersectionObserver();
        this.$observer = observer;
        observer.relativeToViewport({
          bottom: 10,
          top: 10,
          left: 0,
          right: 10
        }).observe('#' + canvasId, function (res) {
          if (res.intersectionRatio > 0) {
            _this2.play();
          } else {
            _this2.stop();
          }
        });
      }
    }
  }, {
    key: 'includeLayers',
    value: function includeLayers(data) {
      if (data.op > this.animationData.op) {
        this.animationData.op = data.op;
        this.totalFrames = Math.floor(data.op - this.animationData.ip);
      }
      var layers = this.animationData.layers;
      var i = void 0;
      var len = layers.length;
      var newLayers = data.layers;
      var j = void 0;
      var jLen = newLayers.length;
      for (j = 0; j < jLen; j += 1) {
        i = 0;
        while (i < len) {
          if (layers[i].id === newLayers[j].id) {
            layers[i] = newLayers[j];
            break;
          }
          i += 1;
        }
      }
      if (data.chars || data.fonts) {
        this.renderer.globalData.fontManager.addChars(data.chars);
        this.renderer.globalData.fontManager.addFonts(data.fonts, this.renderer.globalData.defs);
      }
      if (data.assets) {
        len = data.assets.length;
        for (i = 0; i < len; i += 1) {
          this.animationData.assets.push(data.assets[i]);
        }
      }
      this.animationData.__complete = false;
      _DataManager2.default.completeData(this.animationData, this.renderer.globalData.fontManager);
      this.renderer.includeLayers(data.layers);
      if (_Expressions2.default) {
        _Expressions2.default.initExpressions(this);
      }
      this.loadNextSegment();
    }
  }, {
    key: 'loadNextSegment',
    value: function loadNextSegment() {
      var segments = this.animationData.segments;
      if (!segments || segments.length === 0 || !this.autoloadSegments) {
        this.trigger('data_ready');
        this.timeCompleted = this.totalFrames;
        return;
      }
      var segment = segments.shift();
      this.timeCompleted = segment.time * this.frameRate;
      var segmentPath = this.path + this.fileName + '_' + this.segmentPos + '.json';
      this.segmentPos += 1;
      _assetLoader2.default.load(segmentPath, this.includeLayers.bind(this));
    }
  }, {
    key: 'loadSegments',
    value: function loadSegments() {
      var segments = this.animationData.segments;
      if (!segments) {
        this.timeCompleted = this.totalFrames;
      }
      this.loadNextSegment();
    }
  }, {
    key: 'preloadImages',
    value: function preloadImages() {
      this.imagePreloader = new _ImagePreloader2.default();
      this.imagePreloader.setAssetsPath(this.assetsPath);
      this.imagePreloader.setPath(this.path);
      this.imagePreloader.loadAssets(this.animationData.assets, function (err) {
        if (!err) {
          this.trigger('loaded_images');
        }
      }.bind(this));
    }
  }, {
    key: 'configAnimation',
    value: function configAnimation(animData) {
      if (!this.renderer) {
        return;
      }
      this.animationData = animData;
      this.totalFrames = Math.floor(this.animationData.op - this.animationData.ip);
      this.renderer.configAnimation(animData);
      if (!animData.assets) {
        animData.assets = [];
      }
      this.renderer.searchExtraCompositions(animData.assets);

      this.assets = this.animationData.assets;
      this.frameRate = this.animationData.fr;
      this.firstFrame = Math.round(this.animationData.ip);
      this.frameMult = this.animationData.fr / 1000;
      this.trigger('config_ready');
      this.preloadImages();
      this.loadSegments();
      this.updaFrameModifier();
      this.waitForFontsLoaded();
    }
  }, {
    key: 'completeData',
    value: function completeData() {
      _DataManager2.default.completeData(this.animationData, this.renderer.globalData.fontManager);
      this.checkLoaded();
    }
  }, {
    key: 'waitForFontsLoaded',
    value: function waitForFontsLoaded() {
      if (!this.renderer) {
        return;
      }
      if (true /* this.renderer.globalData.fontManager.loaded */) {
          this.completeData();
        } else {
        setTimeout(this.waitForFontsLoaded.bind(this), 20);
      }
    }
  }, {
    key: 'addPendingElement',
    value: function addPendingElement() {
      this.pendingElements += 1;
    }
  }, {
    key: 'elementLoaded',
    value: function elementLoaded() {
      this.pendingElements -= 1;
      this.checkLoaded();
    }
  }, {
    key: 'checkLoaded',
    value: function checkLoaded() {
      if (this.pendingElements === 0) {
        if (_Expressions2.default) {
          _Expressions2.default.initExpressions(this);
        }
        this.renderer.initItems();
        setTimeout(function () {
          this.trigger('DOMLoaded');
        }.bind(this), 0);
        this.isLoaded = true;
        this.gotoFrame();
        if (this.autoplay) {
          this.play();
        }
      }
    }
  }, {
    key: 'resize',
    value: function resize() {
      this.renderer.updateContainerSize();
    }
  }, {
    key: 'setSubframe',
    value: function setSubframe(flag) {
      this.subframeEnabled = !!flag;
    }
  }, {
    key: 'gotoFrame',
    value: function gotoFrame() {
      this.currentFrame = this.subframeEnabled ? this.currentRawFrame : ~~this.currentRawFrame;

      if (this.timeCompleted !== this.totalFrames && this.currentFrame > this.timeCompleted) {
        this.currentFrame = this.timeCompleted;
      }
      this.trigger('enterFrame');
      this.renderFrame();
    }
  }, {
    key: 'renderFrame',
    value: function renderFrame() {
      if (this.isLoaded === false) {
        return;
      }
      this.renderer.renderFrame(this.currentFrame + this.firstFrame);
    }
  }, {
    key: 'play',
    value: function play(name) {
      if (name && this.name !== name) {
        return;
      }
      if (this.isPaused === true) {
        this.isPaused = false;
        if (this._idle) {
          this._idle = false;
          this.trigger('_active');
        }
      }
    }
  }, {
    key: 'pause',
    value: function pause(name) {
      if (name && this.name !== name) {
        return;
      }
      if (this.isPaused === false) {
        this.isPaused = true;
        this._idle = true;
        this.trigger('_idle');
      }
    }
  }, {
    key: 'togglePause',
    value: function togglePause(name) {
      if (name && this.name !== name) {
        return;
      }
      if (this.isPaused === true) {
        this.play();
      } else {
        this.pause();
      }
    }
  }, {
    key: 'stop',
    value: function stop(name) {
      if (name && this.name !== name) {
        return;
      }
      this.pause();
      this.playCount = 0;
      this.setCurrentRawFrameValue(0);
    }
  }, {
    key: 'goToAndStop',
    value: function goToAndStop(value, isFrame, name) {
      if (name && this.name !== name) {
        return;
      }
      if (isFrame) {
        this.setCurrentRawFrameValue(value);
      } else {
        this.setCurrentRawFrameValue(value * this.frameModifier);
      }
      this.pause();
    }
  }, {
    key: 'goToAndPlay',
    value: function goToAndPlay(value, isFrame, name) {
      this.goToAndStop(value, isFrame, name);
      this.play();
    }
  }, {
    key: 'advanceTime',
    value: function advanceTime(value) {
      if (this.isPaused === true || this.isLoaded === false) {
        return;
      }
      var nextValue = this.currentRawFrame + value * this.frameModifier;
      var _isComplete = false;
      // Checking if nextValue > totalFrames - 1 for addressing non looping and looping animations.
      // If animation won't loop, it should stop at totalFrames - 1. If it will loop it should complete the last frame and then loop.
      if (nextValue >= this.totalFrames - 1 && this.frameModifier > 0) {
        if (!this.loop || this.playCount === this.loop) {
          if (!this.checkSegments(nextValue % this.totalFrames)) {
            _isComplete = true;
            nextValue = this.totalFrames - 1;
          }
        } else if (nextValue >= this.totalFrames) {
          this.playCount += 1;
          if (!this.checkSegments(nextValue % this.totalFrames)) {
            this.setCurrentRawFrameValue(nextValue % this.totalFrames);
            this.trigger('loopComplete');
          }
        } else {
          this.setCurrentRawFrameValue(nextValue);
        }
      } else if (nextValue < 0) {
        if (!this.checkSegments(nextValue % this.totalFrames)) {
          if (this.loop && !(this.playCount-- <= 0 && this.loop !== true)) {
            this.setCurrentRawFrameValue(this.totalFrames + nextValue % this.totalFrames);
            this.trigger('loopComplete');
          } else {
            _isComplete = true;
            nextValue = 0;
          }
        }
      } else {
        this.setCurrentRawFrameValue(nextValue);
      }
      if (_isComplete) {
        this.setCurrentRawFrameValue(nextValue);
        this.pause();
        this.trigger('complete');
      }
    }
  }, {
    key: 'adjustSegment',
    value: function adjustSegment(arr, offset) {
      this.playCount = 0;
      if (arr[1] < arr[0]) {
        if (this.frameModifier > 0) {
          if (this.playSpeed < 0) {
            this.setSpeed(-this.playSpeed);
          } else {
            this.setDirection(-1);
          }
        }
        this.timeCompleted = this.totalFrames = arr[0] - arr[1];
        this.firstFrame = arr[1];
        this.setCurrentRawFrameValue(this.totalFrames - 0.001 - offset);
      } else if (arr[1] > arr[0]) {
        if (this.frameModifier < 0) {
          if (this.playSpeed < 0) {
            this.setSpeed(-this.playSpeed);
          } else {
            this.setDirection(1);
          }
        }
        this.timeCompleted = this.totalFrames = arr[1] - arr[0];
        this.firstFrame = arr[0];
        this.setCurrentRawFrameValue(0.001 + offset);
      }
      this.trigger('segmentStart');
    }
  }, {
    key: 'setSegment',
    value: function setSegment(init, end) {
      var pendingFrame = -1;
      if (this.isPaused) {
        if (this.currentRawFrame + this.firstFrame < init) {
          pendingFrame = init;
        } else if (this.currentRawFrame + this.firstFrame > end) {
          pendingFrame = end - init;
        }
      }

      this.firstFrame = init;
      this.timeCompleted = this.totalFrames = end - init;
      if (pendingFrame !== -1) {
        this.goToAndStop(pendingFrame, true);
      }
    }
  }, {
    key: 'playSegments',
    value: function playSegments(arr, forceFlag) {
      if (_typeof(arr[0]) === 'object') {
        var i = void 0;
        var len = arr.length;
        for (i = 0; i < len; i += 1) {
          this.segments.push(arr[i]);
        }
      } else {
        this.segments.push(arr);
      }
      if (forceFlag) {
        this.checkSegments(0);
      }
      if (this.isPaused) {
        this.play();
      }
    }
  }, {
    key: 'resetSegments',
    value: function resetSegments(forceFlag) {
      this.segments.length = 0;
      this.segments.push([this.animationData.ip, this.animationData.op]);
      // this.segments.push([this.animationData.ip*this.frameRate,Math.floor(this.animationData.op - this.animationData.ip+this.animationData.ip*this.frameRate)]);
      if (forceFlag) {
        this.checkSegments(0);
      }
    }
  }, {
    key: 'checkSegments',
    value: function checkSegments(offset) {
      if (this.segments.length) {
        this.adjustSegment(this.segments.shift(), offset);
        return true;
      }
      return false;
    }
  }, {
    key: 'destroy',
    value: function destroy(name) {
      if (name && this.name !== name || !this.renderer) {
        return;
      }
      this.renderer.destroy();
      this.trigger('destroy');
      this._cbs = null;
      this.onEnterFrame = this.onLoopComplete = this.onComplete = this.onSegmentStart = this.onDestroy = null;
      this.renderer = null;
      if (this.$observer) {
        this.$observer.disconnect();
      }
    }
  }, {
    key: 'setCurrentRawFrameValue',
    value: function setCurrentRawFrameValue(value) {
      this.currentRawFrame = value;
      this.gotoFrame();
    }
  }, {
    key: 'setSpeed',
    value: function setSpeed(val) {
      this.playSpeed = val;
      this.updaFrameModifier();
    }
  }, {
    key: 'setDirection',
    value: function setDirection(val) {
      this.playDirection = val < 0 ? -1 : 1;
      this.updaFrameModifier();
    }
  }, {
    key: 'updaFrameModifier',
    value: function updaFrameModifier() {
      this.frameModifier = this.frameMult * this.playSpeed * this.playDirection;
    }
  }, {
    key: 'getPath',
    value: function getPath() {
      return this.path;
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
    key: 'getAssetData',
    value: function getAssetData(id) {
      var i = 0;
      var len = this.assets.length;
      while (i < len) {
        if (id === this.assets[i].id) {
          return this.assets[i];
        }
        i += 1;
      }
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.renderer.hide();
    }
  }, {
    key: 'show',
    value: function show() {
      this.renderer.show();
    }
  }, {
    key: 'getDuration',
    value: function getDuration(isFrame) {
      return isFrame ? this.totalFrames : this.totalFrames / this.frameRate;
    }
  }, {
    key: 'trigger',
    value: function trigger(name) {
      if (this._cbs && this._cbs[name]) {
        switch (name) {
          case 'enterFrame':
            this.triggerEvent(name, new _common.BMEnterFrameEvent(name, this.currentFrame, this.totalFrames, this.frameMult));
            break;
          case 'loopComplete':
            this.triggerEvent(name, new _common.BMCompleteLoopEvent(name, this.loop, this.playCount, this.frameMult));
            break;
          case 'complete':
            this.triggerEvent(name, new _common.BMCompleteEvent(name, this.frameMult));
            break;
          case 'segmentStart':
            this.triggerEvent(name, new _common.BMSegmentStartEvent(name, this.firstFrame, this.totalFrames));
            break;
          case 'destroy':
            this.triggerEvent(name, new _common.BMDestroyEvent(name, this));
            break;
          default:
            this.triggerEvent(name);
        }
      }
      if (name === 'enterFrame' && this.onEnterFrame) {
        this.onEnterFrame.call(this, new _common.BMEnterFrameEvent(name, this.currentFrame, this.totalFrames, this.frameMult));
      }
      if (name === 'loopComplete' && this.onLoopComplete) {
        this.onLoopComplete.call(this, new _common.BMCompleteLoopEvent(name, this.loop, this.playCount, this.frameMult));
      }
      if (name === 'complete' && this.onComplete) {
        this.onComplete.call(this, new _common.BMCompleteEvent(name, this.frameMult));
      }
      if (name === 'segmentStart' && this.onSegmentStart) {
        this.onSegmentStart.call(this, new _common.BMSegmentStartEvent(name, this.firstFrame, this.totalFrames));
      }
      if (name === 'destroy' && this.onDestroy) {
        this.onDestroy.call(this, new _common.BMDestroyEvent(name, this));
      }
    }
  }]);

  return AnimationItem;
}(_BaseEvent3.default);

exports.default = AnimationItem;