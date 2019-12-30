'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStaticValueAtTime = getStaticValueAtTime;
exports.loopOut = loopOut;
exports.loopIn = loopIn;
exports.getValueAtTime = getValueAtTime;
exports.getSpeedAtTime = getSpeedAtTime;
exports.getVelocityAtTime = getVelocityAtTime;
exports.setGroupProperty = setGroupProperty;
exports.searchExpressions = searchExpressions;
exports.getTransformValueAtTime = getTransformValueAtTime;
exports.getTransformStaticValueAtTime = getTransformStaticValueAtTime;
exports.getShapeValueAtTime = getShapeValueAtTime;
exports.GetTransformProperty = GetTransformProperty;
exports.GetProp = GetProp;
exports.GetShapeProp = GetShapeProp;
exports.TextExpressionSelectorProp = TextExpressionSelectorProp;
exports.GetTextSelectorProp = GetTextSelectorProp;

var _index = require('../index');

var _ExpressionManager = require('./ExpressionManager');

var _ExpressionManager2 = _interopRequireDefault(_ExpressionManager);

var _shape_pool = require('../pooling/shape_pool');

var _shape_pool2 = _interopRequireDefault(_shape_pool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getStaticValueAtTime() {
  return this.pv;
}

function loopOut(type, duration, durationFlag) {
  if (!this.k || !this.keyframes) {
    return this.pv;
  }
  type = type ? type.toLowerCase() : '';
  var currentFrame = this.comp.renderedFrame;
  var keyframes = this.keyframes;
  var lastKeyFrame = keyframes[keyframes.length - 1].t;
  if (currentFrame <= lastKeyFrame) {
    return this.pv;
  }
  var cycleDuration = void 0;
  var firstKeyFrame = void 0;
  if (!durationFlag) {
    if (!duration || duration > keyframes.length - 1) {
      duration = keyframes.length - 1;
    }
    firstKeyFrame = keyframes[keyframes.length - 1 - duration].t;
    cycleDuration = lastKeyFrame - firstKeyFrame;
  } else {
    if (!duration) {
      cycleDuration = Math.max(0, lastKeyFrame - this.elem.data.ip);
    } else {
      cycleDuration = Math.abs(lastKeyFrame - this.elem.comp.globalData.frameRate * duration);
    }
    firstKeyFrame = lastKeyFrame - cycleDuration;
  }
  var i = void 0;
  var len = void 0;
  var ret = void 0;
  if (type === 'pingpong') {
    var iterations = Math.floor((currentFrame - firstKeyFrame) / cycleDuration);
    if (iterations % 2 !== 0) {
      return this.getValueAtTime((cycleDuration - (currentFrame - firstKeyFrame) % cycleDuration + firstKeyFrame) / this.comp.globalData.frameRate, 0);
    }
  } else if (type === 'offset') {
    var initV = this.getValueAtTime(firstKeyFrame / this.comp.globalData.frameRate, 0);
    var endV = this.getValueAtTime(lastKeyFrame / this.comp.globalData.frameRate, 0);
    var current = this.getValueAtTime(((currentFrame - firstKeyFrame) % cycleDuration + firstKeyFrame) / this.comp.globalData.frameRate, 0);
    var repeats = Math.floor((currentFrame - firstKeyFrame) / cycleDuration);
    if (this.pv.length) {
      ret = new Array(initV.length);
      len = ret.length;
      for (i = 0; i < len; i += 1) {
        ret[i] = (endV[i] - initV[i]) * repeats + current[i];
      }
      return ret;
    }
    return (endV - initV) * repeats + current;
  } else if (type === 'continue') {
    var lastValue = this.getValueAtTime(lastKeyFrame / this.comp.globalData.frameRate, 0);
    var nextLastValue = this.getValueAtTime((lastKeyFrame - 0.001) / this.comp.globalData.frameRate, 0);
    if (this.pv.length) {
      ret = new Array(lastValue.length);
      len = ret.length;
      for (i = 0; i < len; i += 1) {
        ret[i] = lastValue[i] + (lastValue[i] - nextLastValue[i]) * ((currentFrame - lastKeyFrame) / this.comp.globalData.frameRate) / 0.0005;
      }
      return ret;
    }
    return lastValue + (lastValue - nextLastValue) * ((currentFrame - lastKeyFrame) / 0.001);
  }
  return this.getValueAtTime(((currentFrame - firstKeyFrame) % cycleDuration + firstKeyFrame) / this.comp.globalData.frameRate, 0);
}

function loopIn(type, duration, durationFlag) {
  if (!this.k) {
    return this.pv;
  }
  type = type ? type.toLowerCase() : '';
  var currentFrame = this.comp.renderedFrame;
  var keyframes = this.keyframes;
  var firstKeyFrame = keyframes[0].t;
  if (currentFrame >= firstKeyFrame) {
    return this.pv;
  }
  var cycleDuration = void 0;
  var lastKeyFrame = void 0;
  if (!durationFlag) {
    if (!duration || duration > keyframes.length - 1) {
      duration = keyframes.length - 1;
    }
    lastKeyFrame = keyframes[duration].t;
    cycleDuration = lastKeyFrame - firstKeyFrame;
  } else {
    if (!duration) {
      cycleDuration = Math.max(0, this.elem.data.op - firstKeyFrame);
    } else {
      cycleDuration = Math.abs(this.elem.comp.globalData.frameRate * duration);
    }
    lastKeyFrame = firstKeyFrame + cycleDuration;
  }
  var i = void 0;
  var len = void 0;
  var ret = void 0;
  if (type === 'pingpong') {
    var iterations = Math.floor((firstKeyFrame - currentFrame) / cycleDuration);
    if (iterations % 2 === 0) {
      return this.getValueAtTime(((firstKeyFrame - currentFrame) % cycleDuration + firstKeyFrame) / this.comp.globalData.frameRate, 0);
    }
  } else if (type === 'offset') {
    var initV = this.getValueAtTime(firstKeyFrame / this.comp.globalData.frameRate, 0);
    var endV = this.getValueAtTime(lastKeyFrame / this.comp.globalData.frameRate, 0);
    var current = this.getValueAtTime((cycleDuration - (firstKeyFrame - currentFrame) % cycleDuration + firstKeyFrame) / this.comp.globalData.frameRate, 0);
    var repeats = Math.floor((firstKeyFrame - currentFrame) / cycleDuration) + 1;
    if (this.pv.length) {
      ret = new Array(initV.length);
      len = ret.length;
      for (i = 0; i < len; i += 1) {
        ret[i] = current[i] - (endV[i] - initV[i]) * repeats;
      }
      return ret;
    }
    return current - (endV - initV) * repeats;
  } else if (type === 'continue') {
    var firstValue = this.getValueAtTime(firstKeyFrame / this.comp.globalData.frameRate, 0);
    var nextFirstValue = this.getValueAtTime((firstKeyFrame + 0.001) / this.comp.globalData.frameRate, 0);
    if (this.pv.length) {
      ret = new Array(firstValue.length);
      len = ret.length;
      for (i = 0; i < len; i += 1) {
        ret[i] = firstValue[i] + (firstValue[i] - nextFirstValue[i]) * (firstKeyFrame - currentFrame) / 0.001;
      }
      return ret;
    }
    return firstValue + (firstValue - nextFirstValue) * (firstKeyFrame - currentFrame) / 0.001;
  }
  return this.getValueAtTime((cycleDuration - (firstKeyFrame - currentFrame) % cycleDuration + firstKeyFrame) / this.comp.globalData.frameRate, 0);
}

function getValueAtTime(frameNum) {
  if (frameNum !== this._cachingAtTime.lastFrame) {
    frameNum *= this.elem.globalData.frameRate;
    frameNum -= this.offsetTime;
    this._cachingAtTime.lastIndex = this._cachingAtTime.lastFrame < frameNum ? this._cachingAtTime.lastIndex : 0;
    this._cachingAtTime.value = this.interpolateValue(frameNum, this._cachingAtTime);
    this._cachingAtTime.lastFrame = frameNum;
  }
  return this._cachingAtTime.value;
}

function getSpeedAtTime(frameNum) {
  var delta = -0.01;
  var v1 = this.getValueAtTime(frameNum);
  var v2 = this.getValueAtTime(frameNum + delta);
  var speed = 0;
  if (v1.length) {
    var i = void 0;
    for (i = 0; i < v1.length; i += 1) {
      speed += Math.pow(v2[i] - v1[i], 2);
    }
    speed = Math.sqrt(speed) * 100;
  } else {
    speed = 0;
  }
  return speed;
}

function getVelocityAtTime(frameNum) {
  if (this.vel !== undefined) {
    return this.vel;
  }
  var delta = -0.001;
  // frameNum += this.elem.data.st;
  var v1 = this.getValueAtTime(frameNum);
  var v2 = this.getValueAtTime(frameNum + delta);
  var velocity = void 0;
  if (v1.length) {
    velocity = (0, _index.createTypedArray)('float32', v1.length);
    var i = void 0;
    for (i = 0; i < v1.length; i += 1) {
      // removing frameRate
      // if needed, don't add it here
      // velocity[i] = this.elem.globalData.frameRate*((v2[i] - v1[i])/delta);
      velocity[i] = (v2[i] - v1[i]) / delta;
    }
  } else {
    velocity = (v2 - v1) / delta;
  }
  return velocity;
}

function setGroupProperty(propertyGroup) {
  this.propertyGroup = propertyGroup;
}

function searchExpressions(elem, data, prop) {
  if (data.x) {
    prop.k = true;
    prop.x = true;
    prop.initiateExpression = _ExpressionManager2.default.initiateExpression;
    prop.effectsSequence.push(prop.initiateExpression(elem, data, prop).bind(prop));
  }
}

function getTransformValueAtTime() {
  console.warn('Transform at time not supported');
}

function getTransformStaticValueAtTime() {}

function getShapeValueAtTime(frameNum) {
  // For now this caching object is created only when needed instead of creating it when the shape is initialized.
  if (!this._cachingAtTime) {
    this._cachingAtTime = {
      shapeValue: _shape_pool2.default.clone(this.pv),
      lastIndex: 0,
      lastTime: -999999
    };
  }
  if (frameNum !== this._cachingAtTime.lastTime) {
    this._cachingAtTime.lastIndex = this._cachingAtTime.lastTime < frameNum ? this._caching.lastIndex : 0;
    this._cachingAtTime.lastTime = frameNum;
    frameNum *= this.elem.globalData.frameRate;
    this.interpolateShape(frameNum, this._cachingAtTime.shapeValue, this._cachingAtTime);
  }
  return this._cachingAtTime.shapeValue;
}

// TransformPropertyFactory.getTransformProperty
function GetTransformProperty(target, name, descriptor) {
  var getTransformProperty = descriptor.value;
  descriptor.value = function (elem, data, container) {
    var prop = getTransformProperty(elem, data, container);
    if (prop.dynamicProperties.length) {
      prop.getValueAtTime = getTransformValueAtTime.bind(prop);
    } else {
      prop.getValueAtTime = getTransformStaticValueAtTime.bind(prop);
    }
    prop.setGroupProperty = setGroupProperty;
    return prop;
  };

  return descriptor;
}

// PropertyFactory.getProp
function GetProp(target, name, descriptor) {
  var propertyGetProp = descriptor.value;
  descriptor.value = function (elem, data, type, mult, container) {
    var prop = propertyGetProp(elem, data, type, mult, container);
    // prop.getVelocityAtTime = getVelocityAtTime;
    // prop.loopOut = loopOut;
    // prop.loopIn = loopIn;
    if (prop.kf) {
      prop.getValueAtTime = getValueAtTime.bind(prop);
    } else {
      prop.getValueAtTime = getStaticValueAtTime.bind(prop);
    }
    prop.setGroupProperty = setGroupProperty;
    prop.loopOut = loopOut;
    prop.loopIn = loopIn;
    prop.getVelocityAtTime = getVelocityAtTime.bind(prop);
    prop.getSpeedAtTime = getSpeedAtTime.bind(prop);
    prop.numKeys = data.a === 1 ? data.k.length : 0;
    prop.propertyIndex = data.ix;
    var value = 0;
    if (type !== 0) {
      value = (0, _index.createTypedArray)('float32', data.a === 1 ? data.k[0].s.length : data.k.length);
    }
    prop._cachingAtTime = {
      lastFrame: -999999,
      lastIndex: 0,
      value: value
    };
    searchExpressions(elem, data, prop);
    if (prop.k) {
      container.addDynamicProperty(prop);
    }

    return prop;
  };
  return descriptor;
}

function GetShapeProp(target, name, descriptor) {
  var propertyGetShapeProp = descriptor.value;

  descriptor.value = function (elem, data, type, arr, trims) {
    var prop = propertyGetShapeProp(elem, data, type, arr, trims);
    prop.propertyIndex = data.ix;
    prop.lock = false;
    if (type === 3) {
      searchExpressions(elem, data.pt, prop);
    } else if (type === 4) {
      searchExpressions(elem, data.ks, prop);
    }
    if (prop.k) {
      elem.addDynamicProperty(prop);
    }
    return prop;
  };

  return descriptor;
}

function getValueProxy(index, total) {
  this.textIndex = index + 1;
  this.textTotal = total;
  this.getValue();
  return this.v;
}

function TextExpressionSelectorProp(elem, data) {
  this.pv = 1;
  this.comp = elem.comp;
  this.elem = elem;
  this.mult = 0.01;
  this.propType = 'textSelector';
  this.textTotal = data.totalChars;
  this.selectorValue = 100;
  this.lastValue = [1, 1, 1];
  searchExpressions.bind(this)(elem, data, this);
  this.getMult = getValueProxy;
  this.getVelocityAtTime = getVelocityAtTime;
  if (this.kf) {
    this.getValueAtTime = getValueAtTime.bind(this);
  } else {
    this.getValueAtTime = getStaticValueAtTime.bind(this);
  }
  this.setGroupProperty = setGroupProperty;
}

//  TextSelectorProp.getTextSelectorProp
function GetTextSelectorProp(target, name, descriptor) {
  var propertyGetTextProp = descriptor.value;

  descriptor.value = function (elem, data, arr) {
    if (data.t === 1) {
      return new TextExpressionSelectorProp(elem, data, arr);
    }
    return propertyGetTextProp(elem, data, arr);
  };

  return descriptor;
}