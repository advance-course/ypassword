'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SliderEffect = SliderEffect;
exports.AngleEffect = AngleEffect;
exports.ColorEffect = ColorEffect;
exports.PointEffect = PointEffect;
exports.LayerIndexEffect = LayerIndexEffect;
exports.MaskIndexEffect = MaskIndexEffect;
exports.CheckboxEffect = CheckboxEffect;
exports.NoValueEffect = NoValueEffect;

var _PropertyFactory = require('../utils/PropertyFactory');

var _PropertyFactory2 = _interopRequireDefault(_PropertyFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SliderEffect(data, elem, container) {
  this.p = _PropertyFactory2.default.getProp(elem, data.v, 0, 0, container);
}
function AngleEffect(data, elem, container) {
  this.p = _PropertyFactory2.default.getProp(elem, data.v, 0, 0, container);
}
function ColorEffect(data, elem, container) {
  this.p = _PropertyFactory2.default.getProp(elem, data.v, 1, 0, container);
}
function PointEffect(data, elem, container) {
  this.p = _PropertyFactory2.default.getProp(elem, data.v, 1, 0, container);
}
function LayerIndexEffect(data, elem, container) {
  this.p = _PropertyFactory2.default.getProp(elem, data.v, 0, 0, container);
}
function MaskIndexEffect(data, elem, container) {
  this.p = _PropertyFactory2.default.getProp(elem, data.v, 0, 0, container);
}
function CheckboxEffect(data, elem, container) {
  this.p = _PropertyFactory2.default.getProp(elem, data.v, 0, 0, container);
}
function NoValueEffect() {
  this.p = {};
}