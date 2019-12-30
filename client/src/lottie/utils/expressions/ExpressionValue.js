'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (elementProp, mult, type) {
  mult = mult || 1;
  var expressionValue = void 0;
  // let arrayValue;

  if (elementProp.k) {
    elementProp.getValue();
  }
  var i = void 0;
  var len = void 0;
  var arrValue = void 0;
  var val = void 0;
  if (type) {
    if (type === 'color') {
      len = 4;
      expressionValue = (0, _index.createTypedArray)('float32', len);
      arrValue = (0, _index.createTypedArray)('float32', len);
      for (i = 0; i < len; i += 1) {
        expressionValue[i] = arrValue[i] = i < 3 ? elementProp.v[i] * mult : 1;
      }
      expressionValue.value = arrValue;
    }
  } else if (elementProp.propType === 'unidimensional') {
    val = elementProp.v * mult;
    /* eslint no-new-wrappers: 0 */
    expressionValue = new Number(val);
    expressionValue.value = val;
  } else {
    len = elementProp.pv.length;
    expressionValue = (0, _index.createTypedArray)('float32', len);
    arrValue = (0, _index.createTypedArray)('float32', len);
    for (i = 0; i < len; i += 1) {
      expressionValue[i] = arrValue[i] = elementProp.v[i] * mult;
    }
    expressionValue.value = arrValue;
  }

  expressionValue.numKeys = elementProp.keyframes ? elementProp.keyframes.length : 0;
  expressionValue.key = function (pos) {
    if (!expressionValue.numKeys) {
      return 0;
    }
    return elementProp.keyframes[pos - 1].t;
  };
  expressionValue.valueAtTime = elementProp.getValueAtTime;
  expressionValue.speedAtTime = elementProp.getSpeedAtTime;
  expressionValue.velocityAtTime = elementProp.getVelocityAtTime;
  expressionValue.propertyGroup = elementProp.propertyGroup;
  return expressionValue;
};

var _index = require('../index');