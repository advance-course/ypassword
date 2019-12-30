'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ShapePropertyFactory = require('../utils/ShapePropertyFactory');

var _ShapePropertyFactory2 = _interopRequireDefault(_ShapePropertyFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CVShapeData = function () {
  function CVShapeData(element, data) {
    _classCallCheck(this, CVShapeData);

    this.nodes = [];
    this.trNodes = [];
    this.tr = [0, 0, 0, 0, 0, 0];
    var ty = 4;
    if (data.ty === 'rc') {
      ty = 5;
    } else if (data.ty === 'el') {
      ty = 6;
    } else if (data.ty === 'sr') {
      ty = 7;
    }
    this.sh = _ShapePropertyFactory2.default.getShapeProp(element, data, ty, element);
    this.st = false;
    this.fl = false;
  }

  _createClass(CVShapeData, [{
    key: 'setAsAnimated',
    value: function setAsAnimated() {
      this._isAnimated = true;
    }
  }]);

  return CVShapeData;
}();

exports.default = CVShapeData;