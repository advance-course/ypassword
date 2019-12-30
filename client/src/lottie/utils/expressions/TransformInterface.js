'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ExpressionValue = require('./ExpressionValue');

var _ExpressionValue2 = _interopRequireDefault(_ExpressionValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var degToRads = Math.PI / 180;

exports.default = function (transform) {
  /* eslint consistent-return: 0 */
  function thisFunction(name) {
    switch (name) {
      case 'scale':
      case 'Scale':
      case 'ADBE Scale':
      case 6:
        return thisFunction.scale;
      case 'rotation':
      case 'Rotation':
      case 'ADBE Rotation':
      case 'ADBE Rotate Z':
      case 10:
        return thisFunction.rotation;
      case 'ADBE Rotate X':
        return thisFunction.xRotation;
      case 'ADBE Rotate Y':
        return thisFunction.yRotation;
      case 'position':
      case 'Position':
      case 'ADBE Position':
      case 2:
        return thisFunction.position;
      case 'ADBE Position_0':
        return thisFunction.xPosition;
      case 'ADBE Position_1':
        return thisFunction.yPosition;
      case 'ADBE Position_2':
        return thisFunction.zPosition;
      case 'anchorPoint':
      case 'AnchorPoint':
      case 'Anchor Point':
      case 'ADBE AnchorPoint':
      case 1:
        return thisFunction.anchorPoint;
      case 'opacity':
      case 'Opacity':
      case 11:
        return thisFunction.opacity;
      default:
        break;
    }
  }

  Object.defineProperty(thisFunction, 'rotation', {
    get: function rotation() {
      if (transform.r) {
        return (0, _ExpressionValue2.default)(transform.r, 1 / degToRads);
      }
      return (0, _ExpressionValue2.default)(transform.rz, 1 / degToRads);
    }
  });

  Object.defineProperty(thisFunction, 'xRotation', {
    get: function get() {
      return (0, _ExpressionValue2.default)(transform.rx, 1 / degToRads);
    }
  });

  Object.defineProperty(thisFunction, 'yRotation', {
    get: function get() {
      return (0, _ExpressionValue2.default)(transform.ry, 1 / degToRads);
    }
  });
  Object.defineProperty(thisFunction, 'scale', {
    get: function get() {
      return (0, _ExpressionValue2.default)(transform.s, 100);
    }
  });

  Object.defineProperty(thisFunction, 'position', {
    get: function get() {
      if (transform.p) {
        return (0, _ExpressionValue2.default)(transform.p);
      }
      return [transform.px.v, transform.py.v, transform.pz ? transform.pz.v : 0];
    }
  });

  Object.defineProperty(thisFunction, 'xPosition', {
    get: function get() {
      return (0, _ExpressionValue2.default)(transform.px);
    }
  });

  Object.defineProperty(thisFunction, 'yPosition', {
    get: function get() {
      return (0, _ExpressionValue2.default)(transform.py);
    }
  });

  Object.defineProperty(thisFunction, 'zPosition', {
    get: function get() {
      return (0, _ExpressionValue2.default)(transform.pz);
    }
  });

  Object.defineProperty(thisFunction, 'anchorPoint', {
    get: function get() {
      return (0, _ExpressionValue2.default)(transform.a);
    }
  });

  Object.defineProperty(thisFunction, 'opacity', {
    get: function get() {
      return (0, _ExpressionValue2.default)(transform.o, 100);
    }
  });

  Object.defineProperty(thisFunction, 'skew', {
    get: function get() {
      return (0, _ExpressionValue2.default)(transform.sk);
    }
  });

  Object.defineProperty(thisFunction, 'skewAxis', {
    get: function get() {
      return (0, _ExpressionValue2.default)(transform.sa);
    }
  });

  Object.defineProperty(thisFunction, 'orientation', {
    get: function get() {
      return (0, _ExpressionValue2.default)(transform.or);
    }
  });

  return thisFunction;
};