"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RenderableElement = function () {
  function RenderableElement() {
    _classCallCheck(this, RenderableElement);
  }

  _createClass(RenderableElement, [{
    key: "initRenderable",
    value: function initRenderable() {
      // layer's visibility related to inpoint and outpoint. Rename isVisible to isInRange
      this.isInRange = false;
      // layer's display state
      this.hidden = false;
      // If layer's transparency equals 0, it can be hidden
      this.isTransparent = false;
      // list of animated components
      this.renderableComponents = [];
    }
  }, {
    key: "addRenderableComponent",
    value: function addRenderableComponent(component) {
      if (this.renderableComponents.indexOf(component) === -1) {
        this.renderableComponents.push(component);
      }
    }
  }, {
    key: "removeRenderableComponent",
    value: function removeRenderableComponent(component) {
      if (this.renderableComponents.indexOf(component) !== -1) {
        this.renderableComponents.splice(this.renderableComponents.indexOf(component), 1);
      }
    }
  }, {
    key: "prepareRenderableFrame",
    value: function prepareRenderableFrame(num) {
      this.checkLayerLimits(num);
    }
  }, {
    key: "checkTransparency",
    value: function checkTransparency() {
      if (this.finalTransform.mProp.o.v <= 0) {
        if (!this.isTransparent && this.globalData.renderConfig.hideOnTransparent) {
          this.isTransparent = true;
          this.hide();
        }
      } else if (this.isTransparent) {
        this.isTransparent = false;
        this.show();
      }
    }
    /**
     * @function
     * Initializes frame related properties.
     *
     * @param {number} num
     * current frame number in Layer's time
     *
     */

  }, {
    key: "checkLayerLimits",
    value: function checkLayerLimits(num) {
      if (this.data.ip - this.data.st <= num && this.data.op - this.data.st > num) {
        if (this.isInRange !== true) {
          this.globalData._mdf = true;
          this._mdf = true;
          this.isInRange = true;
          this.show();
        }
      } else if (this.isInRange !== false) {
        this.globalData._mdf = true;
        this.isInRange = false;
        this.hide();
      }
    }
  }, {
    key: "renderRenderable",
    value: function renderRenderable() {
      var i = void 0;
      var len = this.renderableComponents.length;
      for (i = 0; i < len; i += 1) {
        this.renderableComponents[i].renderFrame(this._isFirstFrame);
      }
      /* this.maskManager.renderFrame(this.finalTransform.mat);
      this.renderableEffectsManager.renderFrame(this._isFirstFrame); */
    }
  }, {
    key: "sourceRectAtTime",
    value: function sourceRectAtTime() {
      return {
        top: 0,
        left: 0,
        width: 100,
        height: 100
      };
    }
  }, {
    key: "getLayerSize",
    value: function getLayerSize() {
      if (this.data.ty === 5) {
        return {
          w: this.data.textData.width,
          h: this.data.textData.height
        };
      }
      return {
        w: this.data.width,
        h: this.data.height
      };
    }
  }]);

  return RenderableElement;
}();

exports.default = RenderableElement;