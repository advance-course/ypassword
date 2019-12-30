'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupEffect = undefined;
exports.EffectsManager = EffectsManager;

var _SliderEffect = require('./effects/SliderEffect');

function EffectsManager(data, element, dynamicProperties) {
  var effects = data.ef || [];
  this.effectElements = [];
  var i = void 0;
  var len = effects.length;
  var effectItem = void 0;
  for (i = 0; i < len; i++) {
    effectItem = new GroupEffect(effects[i], element, dynamicProperties);
    this.effectElements.push(effectItem);
  }
}

function GroupEffect(data, element, dynamicProperties) {
  this.dynamicProperties = [];
  this.init(data, element, this.dynamicProperties);
  if (this.dynamicProperties.length) {
    dynamicProperties.push(this);
  }
}

GroupEffect.prototype.getValue = function () {
  this.mdf = false;
  var i = void 0;
  var len = this.dynamicProperties.length;
  for (i = 0; i < len; i += 1) {
    this.dynamicProperties[i].getValue();
    this.mdf = this.dynamicProperties[i].mdf ? true : this.mdf;
  }
};

GroupEffect.prototype.init = function (data, element, dynamicProperties) {
  this.data = data;
  this.mdf = false;
  this.effectElements = [];
  var i = void 0;
  var len = this.data.ef.length;
  var eff = void 0;
  var effects = this.data.ef;
  for (i = 0; i < len; i += 1) {
    switch (effects[i].ty) {
      case 0:
        eff = new _SliderEffect.SliderEffect(effects[i], element, dynamicProperties);
        this.effectElements.push(eff);
        break;
      case 1:
        eff = new _SliderEffect.AngleEffect(effects[i], element, dynamicProperties);
        this.effectElements.push(eff);
        break;
      case 2:
        eff = new _SliderEffect.ColorEffect(effects[i], element, dynamicProperties);
        this.effectElements.push(eff);
        break;
      case 3:
        eff = new _SliderEffect.PointEffect(effects[i], element, dynamicProperties);
        this.effectElements.push(eff);
        break;
      case 4:
      case 7:
        eff = new _SliderEffect.CheckboxEffect(effects[i], element, dynamicProperties);
        this.effectElements.push(eff);
        break;
      case 5:
        eff = new EffectsManager(effects[i], element, dynamicProperties);
        this.effectElements.push(eff);
        break;
      case 6:
        eff = new _SliderEffect.NoValueEffect(effects[i], element, dynamicProperties);
        this.effectElements.push(eff);
        break;
      default:
        break;
    }
  }
};

exports.GroupEffect = GroupEffect;