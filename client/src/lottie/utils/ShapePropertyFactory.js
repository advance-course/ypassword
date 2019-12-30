'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class;

var _KeyframedShapeProperty = require('./ShapeProperty/KeyframedShapeProperty');

var _KeyframedShapeProperty2 = _interopRequireDefault(_KeyframedShapeProperty);

var _ShapeProperty = require('./ShapeProperty/ShapeProperty');

var _ShapeProperty2 = _interopRequireDefault(_ShapeProperty);

var _RectShapeProperty = require('./ShapeProperty/RectShapeProperty');

var _RectShapeProperty2 = _interopRequireDefault(_RectShapeProperty);

var _EllShapeProperty = require('./ShapeProperty/EllShapeProperty');

var _EllShapeProperty2 = _interopRequireDefault(_EllShapeProperty);

var _StarShapeProperty = require('./ShapeProperty/StarShapeProperty');

var _StarShapeProperty2 = _interopRequireDefault(_StarShapeProperty);

var _Decorator = require('./expressions/Decorator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var ShapePropertyFactory = (_class = function () {
  function ShapePropertyFactory() {
    _classCallCheck(this, ShapePropertyFactory);
  }

  _createClass(ShapePropertyFactory, [{
    key: 'getShapeProp',
    value: function getShapeProp(elem, data, type) {
      var prop = void 0;
      if (type === 3 || type === 4) {
        var dataProp = type === 3 ? data.pt : data.ks;
        var keys = dataProp.k;
        if (dataProp.a === 1 || keys.length) {
          prop = new _KeyframedShapeProperty2.default(elem, data, type);
        } else {
          prop = new _ShapeProperty2.default(elem, data, type);
        }
      } else if (type === 5) {
        prop = new _RectShapeProperty2.default(elem, data);
      } else if (type === 6) {
        prop = new _EllShapeProperty2.default(elem, data);
      } else if (type === 7) {
        prop = new _StarShapeProperty2.default(elem, data);
      }
      if (prop.k) {
        elem.addDynamicProperty(prop);
      }
      return prop;
    }
  }, {
    key: 'getConstructorFunction',
    value: function getConstructorFunction() {
      return _ShapeProperty2.default;
    }
  }, {
    key: 'getKeyframedConstructorFunction',
    value: function getKeyframedConstructorFunction() {
      return _KeyframedShapeProperty2.default;
    }
  }]);

  return ShapePropertyFactory;
}(), (_applyDecoratedDescriptor(_class.prototype, 'getShapeProp', [_Decorator.GetShapeProp], Object.getOwnPropertyDescriptor(_class.prototype, 'getShapeProp'), _class.prototype)), _class);
exports.default = new ShapePropertyFactory();