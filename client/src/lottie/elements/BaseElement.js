'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../utils/index');

var _effects = require('../effects');

var _LayerInterface = require('../utils/expressions/LayerInterface');

var _LayerInterface2 = _interopRequireDefault(_LayerInterface);

var _EffectInterface = require('../utils/expressions/EffectInterface');

var _EffectInterface2 = _interopRequireDefault(_EffectInterface);

var _ShapeInterface = require('../utils/expressions/ShapeInterface');

var _ShapeInterface2 = _interopRequireDefault(_ShapeInterface);

var _CompInterface = require('../utils/expressions/CompInterface');

var _CompInterface2 = _interopRequireDefault(_CompInterface);

var _TransformInterface = require('../utils/expressions/TransformInterface');

var _TransformInterface2 = _interopRequireDefault(_TransformInterface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseElement = function () {
  function BaseElement() {
    _classCallCheck(this, BaseElement);
  }

  _createClass(BaseElement, [{
    key: 'checkMasks',
    value: function checkMasks() {
      if (!this.data.hasMask) {
        return false;
      }
      var i = 0;
      var len = this.data.masksProperties.length;
      while (i < len) {
        if (this.data.masksProperties[i].mode !== 'n' && this.data.masksProperties[i].cl !== false) {
          return true;
        }
        i += 1;
      }
      return false;
    }
  }, {
    key: 'initExpressions',
    value: function initExpressions() {
      this.layerInterface = (0, _LayerInterface2.default)(this);
      if (this.data.hasMask && this.maskManager) {
        this.layerInterface.registerMaskInterface(this.maskManager);
      }
      var effectsInterface = _EffectInterface2.default.createEffectsInterface(this, this.layerInterface);
      this.layerInterface.registerEffectsInterface(effectsInterface);

      if (this.data.ty === 0 || this.data.xt) {
        this.compInterface = (0, _CompInterface2.default)(this);
      } else if (this.data.ty === 4) {
        this.layerInterface.shapeInterface = (0, _ShapeInterface2.default)(this.shapesData, this.itemsData, this.layerInterface);
        this.layerInterface.content = this.layerInterface.shapeInterface;
      } else if (this.data.ty === 5) {
        this.layerInterface.textInterface = (0, _TransformInterface2.default)(this);
        this.layerInterface.text = this.layerInterface.textInterface;
      }
    }
  }, {
    key: 'getBlendMode',
    value: function getBlendMode() {
      return this.blendModeEnums[this.data.bm] || '';
    }
  }, {
    key: 'setBlendMode',
    value: function setBlendMode() {
      var blendModeValue = this.getBlendMode();
      var elem = this.baseElement || this.layerElement;

      elem.style['mix-blend-mode'] = blendModeValue;
    }
  }, {
    key: 'initBaseData',
    value: function initBaseData(data, globalData, comp) {
      this.globalData = globalData;
      this.comp = comp;
      this.data = data;
      this.layerId = 'ly_' + (0, _index.randomString)(10);

      // Stretch factor for old animations missing this property.
      if (!this.data.sr) {
        this.data.sr = 1;
      }
      // effects manager
      this.effectsManager = new _effects.EffectsManager(this.data, this, this.dynamicProperties);
    }
  }, {
    key: 'getType',
    value: function getType() {
      return this.type;
    }
  }, {
    key: 'blendModeEnums',
    get: function get() {
      return {
        1: 'multiply',
        2: 'screen',
        3: 'overlay',
        4: 'darken',
        5: 'lighten',
        6: 'color-dodge',
        7: 'color-burn',
        8: 'hard-light',
        9: 'soft-light',
        10: 'difference',
        11: 'exclusion',
        12: 'hue',
        13: 'saturation',
        14: 'color',
        15: 'luminosity'
      };
    }
  }]);

  return BaseElement;
}();

exports.default = BaseElement;