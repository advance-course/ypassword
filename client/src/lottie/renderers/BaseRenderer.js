'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _FontManager = require('../utils/FontManager');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseRenderer = function () {
  function BaseRenderer() {
    _classCallCheck(this, BaseRenderer);
  }

  _createClass(BaseRenderer, [{
    key: 'checkLayers',
    value: function checkLayers(num) {
      var i = void 0;
      var len = this.layers.length;
      var data = void 0;
      this.completeLayers = true;
      for (i = len - 1; i >= 0; i--) {
        if (!this.elements[i]) {
          data = this.layers[i];
          if (data.ip - data.st <= num - this.layers[i].st && data.op - data.st > num - this.layers[i].st) {
            this.buildItem(i);
          }
        }
        this.completeLayers = this.elements[i] ? this.completeLayers : false;
      }
      this.checkPendingElements();
    }
  }, {
    key: 'createItem',
    value: function createItem(layer) {
      switch (layer.ty) {
        case 2:
          return this.createImage(layer);
        case 0:
          return this.createComp(layer);
        case 1:
          return this.createSolid(layer);
        case 3:
          return this.createNull(layer);
        case 4:
          return this.createShape(layer);
        case 5:
          return this.createText(layer);
        case 13:
          return this.createCamera(layer);
        default:
          break;
      }
      return this.createNull(layer);
    }
  }, {
    key: 'createCamera',
    value: function createCamera() {
      throw new Error('You\'re using a 3d camera. Try the html renderer.');
    }
  }, {
    key: 'buildAllItems',
    value: function buildAllItems() {
      var i = void 0;
      var len = this.layers.length;
      for (i = 0; i < len; i += 1) {
        this.buildItem(i);
      }
      this.checkPendingElements();
    }
  }, {
    key: 'includeLayers',
    value: function includeLayers(newLayers) {
      this.completeLayers = false;
      var i = void 0;
      var len = newLayers.length;
      var j = void 0;
      var jLen = this.layers.length;
      for (i = 0; i < len; i += 1) {
        j = 0;
        while (j < jLen) {
          if (this.layers[j].id === newLayers[i].id) {
            this.layers[j] = newLayers[i];
            break;
          }
          j += 1;
        }
      }
    }
  }, {
    key: 'setProjectInterface',
    value: function setProjectInterface(pInterface) {
      this.globalData.projectInterface = pInterface;
    }
  }, {
    key: 'initItems',
    value: function initItems() {
      if (!this.globalData.progressiveLoad) {
        this.buildAllItems();
      }
    }
  }, {
    key: 'buildElementParenting',
    value: function buildElementParenting(element, parentName, hierarchy) {
      var elements = this.elements;
      var layers = this.layers;
      var i = 0;
      var len = layers.length;
      while (i < len) {
        if (layers[i].ind === parentName) {
          if (!elements[i] || elements[i] === true) {
            this.buildItem(i);
            this.addPendingElement(element);
          } else {
            hierarchy.push(elements[i]);
            elements[i].setAsParent();
            if (layers[i].parent !== undefined) {
              this.buildElementParenting(element, layers[i].parent, hierarchy);
            } else {
              element.setHierarchy(hierarchy);
            }
          }
        }
        i += 1;
      }
    }
  }, {
    key: 'addPendingElement',
    value: function addPendingElement(element) {
      this.pendingElements.push(element);
    }
  }, {
    key: 'searchExtraCompositions',
    value: function searchExtraCompositions(assets) {
      var i = void 0;
      var len = assets.length;
      for (i = 0; i < len; i += 1) {
        if (assets[i].xt) {
          var comp = this.createComp(assets[i]);
          comp.initExpressions();
          this.globalData.projectInterface.registerComposition(comp);
        }
      }
    }
  }, {
    key: 'setupGlobalData',
    value: function setupGlobalData(animData, fontsContainer) {
      this.globalData.fontManager = new _FontManager.FontManager();
      this.globalData.fontManager.addChars(animData.chars);
      this.globalData.fontManager.addFonts(animData.fonts, fontsContainer);
      this.globalData.getAssetData = this.animationItem.getAssetData.bind(this.animationItem);
      this.globalData.getAssetsPath = this.animationItem.getAssetsPath.bind(this.animationItem);
      this.globalData.elementLoaded = this.animationItem.elementLoaded.bind(this.animationItem);
      this.globalData.addPendingElement = this.animationItem.addPendingElement.bind(this.animationItem);
      this.globalData.frameId = 0;
      this.globalData.frameRate = animData.fr;
      this.globalData.nm = animData.nm;
      this.globalData.compSize = {
        w: animData.w,
        h: animData.h
      };
    }
  }]);

  return BaseRenderer;
}();

exports.default = BaseRenderer;