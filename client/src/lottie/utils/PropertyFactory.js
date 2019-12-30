'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class;

var _index = require('./index');

var _BezierEaser = require('../3rd_party/BezierEaser');

var _BezierEaser2 = _interopRequireDefault(_BezierEaser);

var _Decorator = require('./expressions/Decorator');

var _bez = require('./bez');

var _bez2 = _interopRequireDefault(_bez);

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

var initFrame = -999999;
var math_abs = Math.abs;
var degToRads = Math / 180;

function interpolateValue(frameNum, caching) {
  var offsetTime = this.offsetTime;
  var newValue = void 0;
  if (this.propType === 'multidimensional') {
    newValue = (0, _index.createTypedArray)('float32', this.pv.length);
  }
  var iterationIndex = caching.lastIndex;
  var i = iterationIndex;
  var len = this.keyframes.length - 1;
  var flag = true;
  var keyData = void 0;
  var nextKeyData = void 0;

  while (flag) {
    keyData = this.keyframes[i];
    nextKeyData = this.keyframes[i + 1];
    if (i === len - 1 && frameNum >= nextKeyData.t - offsetTime) {
      if (keyData.h) {
        keyData = nextKeyData;
      }
      iterationIndex = 0;
      break;
    }
    if (nextKeyData.t - offsetTime > frameNum) {
      iterationIndex = i;
      break;
    }
    if (i < len - 1) {
      i += 1;
    } else {
      iterationIndex = 0;
      flag = false;
    }
  }

  var k = void 0;
  var kLen = void 0;
  var perc = void 0;
  var jLen = void 0;
  var j = void 0;
  var fnc = void 0;
  if (keyData.to) {
    if (!keyData.bezierData) {
      _bez2.default.buildBezierData(keyData);
    }
    var bezierData = keyData.bezierData;
    if (frameNum >= nextKeyData.t - offsetTime || frameNum < keyData.t - offsetTime) {
      var ind = frameNum >= nextKeyData.t - offsetTime ? bezierData.points.length - 1 : 0;
      kLen = bezierData.points[ind].point.length;
      for (k = 0; k < kLen; k += 1) {
        newValue[k] = bezierData.points[ind].point[k];
      }
      caching._lastBezierData = null;
    } else {
      if (keyData.__fnct) {
        fnc = keyData.__fnct;
      } else {
        fnc = _BezierEaser2.default.getBezierEasing(keyData.o.x, keyData.o.y, keyData.i.x, keyData.i.y, keyData.n).get;
        keyData.__fnct = fnc;
      }
      perc = fnc((frameNum - (keyData.t - offsetTime)) / (nextKeyData.t - offsetTime - (keyData.t - offsetTime)));
      var distanceInLine = bezierData.segmentLength * perc;

      var segmentPerc = void 0;
      var addedLength = caching.lastFrame < frameNum && caching._lastBezierData === bezierData ? caching._lastAddedLength : 0;
      j = caching.lastFrame < frameNum && caching._lastBezierData === bezierData ? caching._lastPoint : 0;
      flag = true;
      jLen = bezierData.points.length;
      while (flag) {
        addedLength += bezierData.points[j].partialLength;
        if (distanceInLine === 0 || perc === 0 || j === bezierData.points.length - 1) {
          kLen = bezierData.points[j].point.length;
          for (k = 0; k < kLen; k += 1) {
            newValue[k] = bezierData.points[j].point[k];
          }
          break;
        } else if (distanceInLine >= addedLength && distanceInLine < addedLength + bezierData.points[j + 1].partialLength) {
          segmentPerc = (distanceInLine - addedLength) / bezierData.points[j + 1].partialLength;
          kLen = bezierData.points[j].point.length;
          for (k = 0; k < kLen; k += 1) {
            newValue[k] = bezierData.points[j].point[k] + (bezierData.points[j + 1].point[k] - bezierData.points[j].point[k]) * segmentPerc;
          }
          break;
        }
        if (j < jLen - 1) {
          j += 1;
        } else {
          flag = false;
        }
      }
      caching._lastPoint = j;
      caching._lastAddedLength = addedLength - bezierData.points[j].partialLength;
      caching._lastBezierData = bezierData;
    }
  } else {
    var outX = void 0;
    var outY = void 0;
    var inX = void 0;
    var inY = void 0;
    var keyValue = void 0;
    len = keyData.s.length;
    if (this.sh && keyData.h !== 1) {
      if (frameNum >= nextKeyData.t - offsetTime) {
        newValue[0] = keyData.e[0];
        newValue[1] = keyData.e[1];
        newValue[2] = keyData.e[2];
      } else if (frameNum <= keyData.t - offsetTime) {
        newValue[0] = keyData.s[0];
        newValue[1] = keyData.s[1];
        newValue[2] = keyData.s[2];
      } else {
        var quatStart = createQuaternion(keyData.s);
        var quatEnd = createQuaternion(keyData.e);
        var time = (frameNum - (keyData.t - offsetTime)) / (nextKeyData.t - offsetTime - (keyData.t - offsetTime));
        quaternionToEuler(newValue, slerp(quatStart, quatEnd, time));
      }
    } else {
      for (i = 0; i < len; i += 1) {
        if (keyData.h !== 1) {
          if (frameNum >= nextKeyData.t - offsetTime) {
            perc = 1;
          } else if (frameNum < keyData.t - offsetTime) {
            perc = 0;
          } else {
            if (keyData.o.x.constructor === Array) {
              if (!keyData.__fnct) {
                keyData.__fnct = [];
              }
              if (!keyData.__fnct[i]) {
                outX = keyData.o.x[i] || keyData.o.x[0];
                outY = keyData.o.y[i] || keyData.o.y[0];
                inX = keyData.i.x[i] || keyData.i.x[0];
                inY = keyData.i.y[i] || keyData.i.y[0];
                fnc = _BezierEaser2.default.getBezierEasing(outX, outY, inX, inY).get;
                keyData.__fnct[i] = fnc;
              } else {
                fnc = keyData.__fnct[i];
              }
            } else if (!keyData.__fnct) {
              outX = keyData.o.x;
              outY = keyData.o.y;
              inX = keyData.i.x;
              inY = keyData.i.y;
              fnc = _BezierEaser2.default.getBezierEasing(outX, outY, inX, inY).get;
              keyData.__fnct = fnc;
            } else {
              fnc = keyData.__fnct;
            }
            perc = fnc((frameNum - (keyData.t - offsetTime)) / (nextKeyData.t - offsetTime - (keyData.t - offsetTime)));
          }
        }

        keyValue = keyData.h === 1 ? keyData.s[i] : keyData.s[i] + (keyData.e[i] - keyData.s[i]) * perc;

        if (len === 1) {
          newValue = keyValue;
        } else {
          newValue[i] = keyValue;
        }
      }
    }
  }
  caching.lastIndex = iterationIndex;
  return newValue;
}

// based on @Toji's https://github.com/toji/gl-matrix/
function slerp(a, b, t) {
  var out = [];
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  var aw = a[3];
  var bx = b[0];
  var by = b[1];
  var bz = b[2];
  var bw = b[3];
  var omega = void 0;
  var cosom = void 0;
  var sinom = void 0;
  var scale0 = void 0;
  var scale1 = void 0;

  cosom = ax * bx + ay * by + az * bz + aw * bw;
  if (cosom < 0.0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  }
  if (1.0 - cosom > 0.000001) {
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    scale0 = 1.0 - t;
    scale1 = t;
  }
  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;

  return out;
}

function quaternionToEuler(out, quat) {
  var qx = quat[0];
  var qy = quat[1];
  var qz = quat[2];
  var qw = quat[3];
  var heading = Math.atan2(2 * qy * qw - 2 * qx * qz, 1 - 2 * qy * qy - 2 * qz * qz);
  var attitude = Math.asin(2 * qx * qy + 2 * qz * qw);
  var bank = Math.atan2(2 * qx * qw - 2 * qy * qz, 1 - 2 * qx * qx - 2 * qz * qz);
  out[0] = heading / degToRads;
  out[1] = attitude / degToRads;
  out[2] = bank / degToRads;
}

function createQuaternion(values) {
  var heading = values[0] * degToRads;
  var attitude = values[1] * degToRads;
  var bank = values[2] * degToRads;
  var c1 = Math.cos(heading / 2);
  var c2 = Math.cos(attitude / 2);
  var c3 = Math.cos(bank / 2);
  var s1 = Math.sin(heading / 2);
  var s2 = Math.sin(attitude / 2);
  var s3 = Math.sin(bank / 2);
  var w = c1 * c2 * c3 - s1 * s2 * s3;
  var x = s1 * s2 * c3 + c1 * c2 * s3;
  var y = s1 * c2 * c3 + c1 * s2 * s3;
  var z = c1 * s2 * c3 - s1 * c2 * s3;

  return [x, y, z, w];
}

function getValueAtCurrentTime() {
  var frameNum = this.comp.renderedFrame - this.offsetTime;
  var initTime = this.keyframes[0].t - this.offsetTime;
  var endTime = this.keyframes[this.keyframes.length - 1].t - this.offsetTime;
  if (!(frameNum === this._caching.lastFrame || this._caching.lastFrame !== initFrame && (this._caching.lastFrame >= endTime && frameNum >= endTime || this._caching.lastFrame < initTime && frameNum < initTime))) {
    this._caching.lastIndex = this._caching.lastFrame < frameNum ? this._caching.lastIndex : 0;
    var renderResult = this.interpolateValue(frameNum, this._caching);
    this.pv = renderResult;
  }
  this._caching.lastFrame = frameNum;
  return this.pv;
}

function setVValue(val) {
  var multipliedValue = void 0;
  if (this.propType === 'unidimensional') {
    multipliedValue = val * this.mult;
    if (math_abs(this.v - multipliedValue) > 0.00001) {
      this.v = multipliedValue;
      this._mdf = true;
    }
  } else {
    var i = 0;
    var len = this.v.length;
    while (i < len) {
      multipliedValue = val[i] * this.mult;
      if (math_abs(this.v[i] - multipliedValue) > 0.00001) {
        this.v[i] = multipliedValue;
        this._mdf = true;
      }
      i += 1;
    }
  }
}

function processEffectsSequence() {
  if (this.elem.globalData.frameId === this.frameId || !this.effectsSequence.length) {
    return;
  }
  if (this.lock) {
    this.setVValue(this.pv);
    return;
  }
  this.lock = true;
  this._mdf = this._isFirstFrame;
  // let multipliedValue;
  var i = void 0;
  var len = this.effectsSequence.length;
  var finalValue = this.kf ? this.pv : this.data.k;
  for (i = 0; i < len; i += 1) {
    finalValue = this.effectsSequence[i](finalValue);
  }
  this.setVValue(finalValue);
  this._isFirstFrame = false;
  this.lock = false;
  this.frameId = this.elem.globalData.frameId;
}

function addEffect(effectFunction) {
  this.effectsSequence.push(effectFunction);
  this.container.addDynamicProperty(this);
}

function ValueProperty(elem, data, mult, container) {
  this.propType = 'unidimensional';
  this.mult = mult || 1;
  this.data = data;
  this.v = mult ? data.k * mult : data.k;
  this.pv = data.k;
  this._mdf = false;
  this.elem = elem;
  this.container = container;
  this.comp = elem.comp;
  this.k = false;
  this.kf = false;
  this.vel = 0;
  this.effectsSequence = [];
  this._isFirstFrame = true;
  this.getValue = processEffectsSequence;
  this.setVValue = setVValue;
  this.addEffect = addEffect;
}

function MultiDimensionalProperty(elem, data, mult, container) {
  this.propType = 'multidimensional';
  this.mult = mult || 1;
  this.data = data;
  this._mdf = false;
  this.elem = elem;
  this.container = container;
  this.comp = elem.comp;
  this.k = false;
  this.kf = false;
  this.frameId = -1;
  var i = void 0;
  var len = data.k.length;
  this.v = (0, _index.createTypedArray)('float32', len);
  this.pv = (0, _index.createTypedArray)('float32', len);
  // let arr = createTypedArray('float32', len);
  this.vel = (0, _index.createTypedArray)('float32', len);
  for (i = 0; i < len; i += 1) {
    this.v[i] = data.k[i] * this.mult;
    this.pv[i] = data.k[i];
  }
  this._isFirstFrame = true;
  this.effectsSequence = [];
  this.getValue = processEffectsSequence;
  this.setVValue = setVValue;
  this.addEffect = addEffect;
}

function KeyframedValueProperty(elem, data, mult, container) {
  this.propType = 'unidimensional';
  this.keyframes = data.k;
  this.offsetTime = elem.data.st;
  this.frameId = -1;
  this._caching = {
    lastFrame: initFrame,
    lastIndex: 0,
    value: 0
  };
  this.k = true;
  this.kf = true;
  this.data = data;
  this.mult = mult || 1;
  this.elem = elem;
  this.container = container;
  this.comp = elem.comp;
  this.v = initFrame;
  this.pv = initFrame;
  this._isFirstFrame = true;
  this.getValue = processEffectsSequence;
  this.setVValue = setVValue;
  this.interpolateValue = interpolateValue;
  this.effectsSequence = [getValueAtCurrentTime.bind(this)];
  this.addEffect = addEffect;
}

function KeyframedMultidimensionalProperty(elem, data, mult, container) {
  this.propType = 'multidimensional';
  var i = void 0;
  var len = data.k.length;
  var s = void 0;
  var e = void 0;
  var to = void 0;
  var ti = void 0;
  for (i = 0; i < len - 1; i += 1) {
    if (data.k[i].to && data.k[i].s && data.k[i].e) {
      s = data.k[i].s;
      e = data.k[i].e;
      to = data.k[i].to;
      ti = data.k[i].ti;
      if (s.length === 2 && !(s[0] === e[0] && s[1] === e[1]) && _bez2.default.pointOnLine2D(s[0], s[1], e[0], e[1], s[0] + to[0], s[1] + to[1]) && _bez2.default.pointOnLine2D(s[0], s[1], e[0], e[1], e[0] + ti[0], e[1] + ti[1]) || s.length === 3 && !(s[0] === e[0] && s[1] === e[1] && s[2] === e[2]) && _bez2.default.pointOnLine3D(s[0], s[1], s[2], e[0], e[1], e[2], s[0] + to[0], s[1] + to[1], s[2] + to[2]) && _bez2.default.pointOnLine3D(s[0], s[1], s[2], e[0], e[1], e[2], e[0] + ti[0], e[1] + ti[1], e[2] + ti[2])) {
        data.k[i].to = null;
        data.k[i].ti = null;
      }
      if (s[0] === e[0] && s[1] === e[1] && to[0] === 0 && to[1] === 0 && ti[0] === 0 && ti[1] === 0) {
        if (s.length === 2 || s[2] === e[2] && to[2] === 0 && ti[2] === 0) {
          data.k[i].to = null;
          data.k[i].ti = null;
        }
      }
    }
  }
  this.effectsSequence = [getValueAtCurrentTime.bind(this)];
  this.keyframes = data.k;
  this.offsetTime = elem.data.st;
  this.k = true;
  this.kf = true;
  this._isFirstFrame = true;
  this.mult = mult || 1;
  this.elem = elem;
  this.container = container;
  this.comp = elem.comp;
  this.getValue = processEffectsSequence;
  this.setVValue = setVValue;
  this.interpolateValue = interpolateValue;
  this.frameId = -1;
  var arrLen = data.k[0].s.length;
  this.v = (0, _index.createTypedArray)('float32', arrLen);
  this.pv = (0, _index.createTypedArray)('float32', arrLen);
  for (i = 0; i < arrLen; i += 1) {
    this.v[i] = initFrame;
    this.pv[i] = initFrame;
  }
  this._caching = {
    lastFrame: initFrame,
    lastIndex: 0,
    value: (0, _index.createTypedArray)('float32', arrLen)
  };
  this.addEffect = addEffect;
}

var PropertyFactory = (_class = function () {
  function PropertyFactory() {
    _classCallCheck(this, PropertyFactory);
  }

  _createClass(PropertyFactory, [{
    key: 'getProp',
    value: function getProp(elem, data, type, mult, container) {
      var p = void 0;
      if (data.a === 0) {
        if (type === 0) {
          p = new ValueProperty(elem, data, mult, container);
        } else {
          p = new MultiDimensionalProperty(elem, data, mult, container);
        }
      } else if (data.a === 1) {
        if (type === 0) {
          p = new KeyframedValueProperty(elem, data, mult, container);
        } else {
          p = new KeyframedMultidimensionalProperty(elem, data, mult, container);
        }
      } else if (!data.k.length) {
        p = new ValueProperty(elem, data, mult, container);
      } else if (typeof data.k[0] === 'number') {
        p = new MultiDimensionalProperty(elem, data, mult, container);
      } else {
        switch (type) {
          case 0:
            p = new KeyframedValueProperty(elem, data, mult, container);
            break;
          case 1:
            p = new KeyframedMultidimensionalProperty(elem, data, mult, container);
            break;
          default:
            break;
        }
      }
      if (p.effectsSequence.length) {
        container.addDynamicProperty(p);
      }
      return p;
    }
  }]);

  return PropertyFactory;
}(), (_applyDecoratedDescriptor(_class.prototype, 'getProp', [_Decorator.GetProp], Object.getOwnPropertyDescriptor(_class.prototype, 'getProp'), _class.prototype)), _class);
exports.default = new PropertyFactory();