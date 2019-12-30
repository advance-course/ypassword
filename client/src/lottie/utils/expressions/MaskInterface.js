'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (maskManager) {
  var _masksInterfaces = (0, _index.createSizedArray)(maskManager.viewData.length);
  var i = void 0;
  var len = maskManager.viewData.length;
  for (i = 0; i < len; i += 1) {
    _masksInterfaces[i] = new MaskInterface(maskManager.viewData[i], maskManager.masksProperties[i]);
  }

  var maskFunction = function maskFunction(name) {
    i = 0;
    while (i < len) {
      if (maskManager.masksProperties[i].nm === name) {
        return _masksInterfaces[i];
      }
      i += 1;
    }
  };
  return maskFunction;
};

var _index = require('../index');

function MaskInterface(mask, data) {
  this._mask = mask;
  this._data = data;
}
Object.defineProperty(MaskInterface.prototype, 'maskPath', {
  get: function get() {
    if (this._mask.prop.k) {
      this._mask.prop.getValue();
    }
    return this._mask.prop;
  }
});