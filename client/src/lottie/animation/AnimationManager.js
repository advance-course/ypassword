'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../utils/index');

var _AnimationItem = require('./AnimationItem');

var _AnimationItem2 = _interopRequireDefault(_AnimationItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AnimationManager = function () {
  function AnimationManager() {
    _classCallCheck(this, AnimationManager);

    this.moduleOb = {};
    this.registeredAnimations = [];
    this.initTime = 0;
    this.len = 0;
    this.playingAnimationsNum = 0;
    this._stopped = true;
    this._isFrozen = false;
  }

  _createClass(AnimationManager, [{
    key: 'removeElement',
    value: function removeElement(ev) {
      var i = 0;
      var animItem = ev.target;
      var registeredAnimations = this.registeredAnimations;
      while (i < this.len) {
        if (registeredAnimations[i].animation === animItem) {
          registeredAnimations.splice(i, 1);
          i -= 1;
          this.len -= 1;
          if (!animItem.isPaused) {
            this.subtractPlayingCount();
          }
        }
        i += 1;
      }
    }
  }, {
    key: 'getRegisteredAnimations',
    value: function getRegisteredAnimations() {
      var registeredAnimations = this.registeredAnimations;
      var i = void 0;
      var len = registeredAnimations.length;
      var animations = [];
      for (i = 0; i < len; i += 1) {
        animations.push(registeredAnimations[i].animation);
      }
      return animations;
    }
  }, {
    key: 'addPlayingCount',
    value: function addPlayingCount() {
      this.playingAnimationsNum += 1;
      this.activate();
    }
  }, {
    key: 'subtractPlayingCount',
    value: function subtractPlayingCount() {
      this.playingAnimationsNum -= 1;
    }
  }, {
    key: 'setupAnimation',
    value: function setupAnimation(animItem, element) {
      animItem.addEventListener('destroy', this.removeElement.bind(this));
      animItem.addEventListener('_active', this.addPlayingCount.bind(this));
      animItem.addEventListener('_idle', this.subtractPlayingCount.bind(this));
      this.registeredAnimations.push({
        elem: element,
        animation: animItem
      });
      this.len += 1;
    }
  }, {
    key: 'loadAnimation',
    value: function loadAnimation(params) {
      var animItem = new _AnimationItem2.default();
      this.setupAnimation(animItem, null);
      animItem.setParams(params);
      return animItem;
    }
  }, {
    key: 'setSpeed',
    value: function setSpeed(val, animation) {
      var i = void 0;
      var registeredAnimations = this.registeredAnimations;
      for (i = 0; i < this.len; i += 1) {
        registeredAnimations[i].animation.setSpeed(val, animation);
      }
    }
  }, {
    key: 'setDirection',
    value: function setDirection(val, animation) {
      var i = void 0;
      var registeredAnimations = this.registeredAnimations;
      for (i = 0; i < this.len; i += 1) {
        registeredAnimations[i].animation.setDirection(val, animation);
      }
    }
  }, {
    key: 'play',
    value: function play(animation) {
      var i = void 0;
      var registeredAnimations = this.registeredAnimations;
      for (i = 0; i < this.len; i += 1) {
        registeredAnimations[i].animation.play(animation);
      }
    }
  }, {
    key: 'resume',
    value: function resume(nowTime) {
      var elapsedTime = ~~(nowTime - this.initTime);
      var registeredAnimations = this.registeredAnimations;
      var i = void 0;
      for (i = 0; i < this.len; i += 1) {
        registeredAnimations[i].animation.advanceTime(elapsedTime);
      }
      this.initTime = nowTime;
      if (this.playingAnimationsNum && !this._isFrozen) {
        (0, _index.raf)(this.resume.bind(this));
      } else {
        this._stopped = true;
      }
    }
  }, {
    key: 'first',
    value: function first(nowTime) {
      this.initTime = nowTime;
      (0, _index.raf)(this.resume.bind(this));
    }
  }, {
    key: 'pause',
    value: function pause(animation) {
      var i = void 0;
      var registeredAnimations = this.registeredAnimations;
      for (i = 0; i < this.len; i += 1) {
        registeredAnimations[i].animation.pause(animation);
      }
    }
  }, {
    key: 'goToAndStop',
    value: function goToAndStop(value, isFrame, animation) {
      var i = void 0;
      var registeredAnimations = this.registeredAnimations;
      for (i = 0; i < this.len; i += 1) {
        registeredAnimations[i].animation.goToAndStop(value, isFrame, animation);
      }
    }
  }, {
    key: 'stop',
    value: function stop(animation) {
      var i = void 0;
      var registeredAnimations = this.registeredAnimations;
      for (i = 0; i < this.len; i += 1) {
        registeredAnimations[i].animation.stop(animation);
      }
    }
  }, {
    key: 'togglePause',
    value: function togglePause(animation) {
      var i = void 0;
      var registeredAnimations = this.registeredAnimations;
      for (i = 0; i < this.len; i += 1) {
        registeredAnimations[i].animation.togglePause(animation);
      }
    }
  }, {
    key: 'destroy',
    value: function destroy(animation) {
      var i = void 0;
      var registeredAnimations = this.registeredAnimations;
      for (i = this.len - 1; i >= 0; i -= 1) {
        registeredAnimations[i].animation.destroy(animation);
      }
      this.registeredAnimations.length = 0;
      this.len = 0;
    }
  }, {
    key: 'resize',
    value: function resize() {
      var i = void 0;
      var registeredAnimations = this.registeredAnimations;
      for (i = 0; i < this.len; i += 1) {
        registeredAnimations[i].animation.resize();
      }
    }
  }, {
    key: 'activate',
    value: function activate() {
      if (!this._isFrozen && this.playingAnimationsNum) {
        if (this._stopped) {
          (0, _index.raf)(this.first.bind(this));
          this._stopped = false;
        }
      }
    }
  }, {
    key: 'freeze',
    value: function freeze() {
      this._isFrozen = true;
    }
  }, {
    key: 'unfreeze',
    value: function unfreeze() {
      this._isFrozen = false;
      this.activate();
    }
  }]);

  return AnimationManager;
}();

exports.default = new AnimationManager();