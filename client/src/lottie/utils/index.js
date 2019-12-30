'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSizedArray = createSizedArray;
exports.createTypedArray = createTypedArray;
exports.createTag = createTag;
exports.randomString = randomString;
exports.getDescriptor = getDescriptor;
exports.createProxyFunction = createProxyFunction;
var defaultCurveSegments = exports.defaultCurveSegments = 200;

function rafFactory() {
  // if (typeof requestAnimationFrame !== 'undefined') return requestAnimationFrame;
  var lastTime = Date.now();
  var FPS60 = 1000 / 60;
  var FPS24 = 1000 / 24;
  return function Raf(callback) {
    var currTime = Date.now();
    // pref：优化js密集计算 资源竞争恶性循环
    var timeToCall = Math.min(FPS24, Math.max(FPS60, FPS60 + (currTime - lastTime)));
    // let timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = setTimeout(function () {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
}

var raf = exports.raf = rafFactory();

function createSizedArray(len) {
  return Array.apply(null, {
    length: len
  });
}

function createTypedArray(type, len) {
  if (type === 'float32') {
    return new Float32Array(len);
  } else if (type === 'int16') {
    return new Int16Array(len);
  } else if (type === 'uint8c') {
    return new Uint8ClampedArray(len);
  }
  return null;
}

function createTag(type) {
  var tag = {};
  switch (type) {
    case 'canvas':
      tag.getContext = function () {
        // TODO: get temp canvas
      };
      return tag;
    default:
      return tag;
  }
}

function randomString(length, chars) {
  if (chars === undefined) {
    chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  }
  var i = void 0;
  var result = '';
  for (i = length; i > 0; --i) {
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  }return result;
}

var subframeEnabled = exports.subframeEnabled = true;

function getDescriptor(object, prop) {
  return Object.getOwnPropertyDescriptor(object, prop);
}

function createProxyFunction(prototype) {
  function ProxyFunction() {}
  ProxyFunction.prototype = prototype;
  return ProxyFunction;
}