'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initFrame = undefined;
exports.interpolateShape = interpolateShape;
exports.interpolateShapeCurrentTime = interpolateShapeCurrentTime;
exports.resetShape = resetShape;
exports.shapesEqual = shapesEqual;
exports.processEffectsSequence = processEffectsSequence;
exports.addEffect = addEffect;

var _BezierEaser = require('../../3rd_party/BezierEaser');

var _BezierEaser2 = _interopRequireDefault(_BezierEaser);

var _shape_pool = require('../pooling/shape_pool');

var _shape_pool2 = _interopRequireDefault(_shape_pool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initFrame = exports.initFrame = -9999;

function interpolateShape(frameNum, previousValue, caching) {
  var iterationIndex = caching.lastIndex;
  var keyPropS = void 0;
  var keyPropE = void 0;
  var isHold = void 0;
  var j = void 0;
  var k = void 0;
  var jLen = void 0;
  var kLen = void 0;
  var perc = void 0;
  var vertexValue = void 0;
  var kf = this.keyframes;
  if (frameNum < kf[0].t - this.offsetTime) {
    keyPropS = kf[0].s[0];
    isHold = true;
    iterationIndex = 0;
  } else if (frameNum >= kf[kf.length - 1].t - this.offsetTime) {
    if (kf[kf.length - 2].h === 1) {
      keyPropS = kf[kf.length - 1].s[0];
    } else {
      keyPropS = kf[kf.length - 2].e[0];
    }
    isHold = true;
  } else {
    var i = iterationIndex;
    var len = kf.length - 1;
    var flag = true;
    var keyData = void 0;
    var nextKeyData = void 0;
    while (flag) {
      keyData = kf[i];
      nextKeyData = kf[i + 1];
      if (nextKeyData.t - this.offsetTime > frameNum) {
        break;
      }
      if (i < len - 1) {
        i += 1;
      } else {
        flag = false;
      }
    }
    isHold = keyData.h === 1;
    iterationIndex = i;
    if (!isHold) {
      if (frameNum >= nextKeyData.t - this.offsetTime) {
        perc = 1;
      } else if (frameNum < keyData.t - this.offsetTime) {
        perc = 0;
      } else {
        var fnc = void 0;
        if (keyData.__fnct) {
          fnc = keyData.__fnct;
        } else {
          fnc = _BezierEaser2.default.getBezierEasing(keyData.o.x, keyData.o.y, keyData.i.x, keyData.i.y).get;
          keyData.__fnct = fnc;
        }
        perc = fnc((frameNum - (keyData.t - this.offsetTime)) / (nextKeyData.t - this.offsetTime - (keyData.t - this.offsetTime)));
      }
      keyPropE = keyData.e[0];
    }
    keyPropS = keyData.s[0];
  }
  jLen = previousValue._length;
  kLen = keyPropS.i[0].length;
  caching.lastIndex = iterationIndex;

  for (j = 0; j < jLen; j += 1) {
    for (k = 0; k < kLen; k += 1) {
      vertexValue = isHold ? keyPropS.i[j][k] : keyPropS.i[j][k] + (keyPropE.i[j][k] - keyPropS.i[j][k]) * perc;
      previousValue.i[j][k] = vertexValue;
      vertexValue = isHold ? keyPropS.o[j][k] : keyPropS.o[j][k] + (keyPropE.o[j][k] - keyPropS.o[j][k]) * perc;
      previousValue.o[j][k] = vertexValue;
      vertexValue = isHold ? keyPropS.v[j][k] : keyPropS.v[j][k] + (keyPropE.v[j][k] - keyPropS.v[j][k]) * perc;
      previousValue.v[j][k] = vertexValue;
    }
  }
}

function interpolateShapeCurrentTime() {
  var frameNum = this.comp.renderedFrame - this.offsetTime;
  var initTime = this.keyframes[0].t - this.offsetTime;
  var endTime = this.keyframes[this.keyframes.length - 1].t - this.offsetTime;
  var lastFrame = this._caching.lastFrame;
  if (!(lastFrame !== initFrame && (lastFrame < initTime && frameNum < initTime || lastFrame > endTime && frameNum > endTime))) {
    // //
    this._caching.lastIndex = lastFrame < frameNum ? this._caching.lastIndex : 0;
    this.interpolateShape(frameNum, this.pv, this._caching);
    // //
  }
  this._caching.lastFrame = frameNum;
  return this.pv;
}

function resetShape() {
  this.paths = this.localShapeCollection;
}

function shapesEqual(shape1, shape2) {
  if (shape1._length !== shape2._length || shape1.c !== shape2.c) {
    return false;
  }
  var i = void 0;
  var len = shape1._length;
  for (i = 0; i < len; i += 1) {
    if (shape1.v[i][0] !== shape2.v[i][0] || shape1.v[i][1] !== shape2.v[i][1] || shape1.o[i][0] !== shape2.o[i][0] || shape1.o[i][1] !== shape2.o[i][1] || shape1.i[i][0] !== shape2.i[i][0] || shape1.i[i][1] !== shape2.i[i][1]) {
      return false;
    }
  }
  return true;
}

function processEffectsSequence() {
  if (this.lock || this.elem.globalData.frameId === this.frameId) {
    return;
  }
  this.lock = true;
  this.frameId = this.elem.globalData.frameId;
  this._mdf = false;
  /* eslint no-nested-ternary: 0 */
  var finalValue = this.kf ? this.pv : this.data.ks ? this.data.ks.k : this.data.pt.k;
  var i = void 0;
  var len = this.effectsSequence.length;
  for (i = 0; i < len; i += 1) {
    finalValue = this.effectsSequence[i](finalValue);
  }
  if (!shapesEqual(this.v, finalValue)) {
    this.v = _shape_pool2.default.clone(finalValue);
    this.localShapeCollection.releaseShapes();
    this.localShapeCollection.addShape(this.v);
    this._mdf = true;
    this.paths = this.localShapeCollection;
  }
  this.lock = false;
}

function addEffect(effectFunction) {
  this.effectsSequence.push(effectFunction);
  this.container.addDynamicProperty(this);
}