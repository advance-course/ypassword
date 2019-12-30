'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShapeModifier = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _shapeCollection_pool = require('../utils/pooling/shapeCollection_pool');

var _shapeCollection_pool2 = _interopRequireDefault(_shapeCollection_pool);

var _dynamicProperties = require('../utils/dynamicProperties');

var _dynamicProperties2 = _interopRequireDefault(_dynamicProperties);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ShapeModifier = exports.ShapeModifier = function (_DynamicPropertyConta) {
  _inherits(ShapeModifier, _DynamicPropertyConta);

  function ShapeModifier() {
    _classCallCheck(this, ShapeModifier);

    return _possibleConstructorReturn(this, (ShapeModifier.__proto__ || Object.getPrototypeOf(ShapeModifier)).apply(this, arguments));
  }

  _createClass(ShapeModifier, [{
    key: 'initModifierProperties',
    value: function initModifierProperties() {}
  }, {
    key: 'addShapeToModifier',
    value: function addShapeToModifier() {}
  }, {
    key: 'addShape',
    value: function addShape(data) {
      if (!this.closed) {
        var shapeData = {
          shape: data.sh,
          data: data,
          localShapeCollection: _shapeCollection_pool2.default.newShapeCollection()
        };
        this.shapes.push(shapeData);
        this.addShapeToModifier(shapeData);
        if (this._isAnimated) {
          data.setAsAnimated();
        }
      }
    }
  }, {
    key: 'init',
    value: function init(elem, data) {
      this.shapes = [];
      this.elem = elem;
      this.initDynamicPropertyContainer(elem);
      this.initModifierProperties(elem, data);
      this.frameId = -999999;
      this.closed = false;
      this.k = false;
      if (this.dynamicProperties.length) {
        this.k = true;
      } else {
        this.getValue(true);
      }
    }
  }, {
    key: 'processKeys',
    value: function processKeys() {
      if (this.elem.globalData.frameId === this.frameId) {
        return;
      }
      this.frameId = this.elem.globalData.frameId;
      this.iterateDynamicProperties();
    }
  }]);

  return ShapeModifier;
}(_dynamicProperties2.default);

var modifiers = {};

exports.default = {
  registerModifier: function registerModifier(nm, factory) {
    if (!modifiers[nm]) {
      modifiers[nm] = factory;
    }
  },
  getModifier: function getModifier(nm, elem, data) {
    return new modifiers[nm](elem, data);
  }
};