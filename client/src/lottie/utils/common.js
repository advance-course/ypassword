"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RGBtoHSV = RGBtoHSV;
exports.HSVtoRGB = HSVtoRGB;
exports.addHueToRGB = addHueToRGB;
exports.addSaturationToRGB = addSaturationToRGB;
exports.addBrightnessToRGB = addBrightnessToRGB;
exports.BMEnterFrameEvent = BMEnterFrameEvent;
exports.BMCompleteEvent = BMCompleteEvent;
exports.BMCompleteLoopEvent = BMCompleteLoopEvent;
exports.BMSegmentStartEvent = BMSegmentStartEvent;
exports.BMDestroyEvent = BMDestroyEvent;
var subframeEnabled = exports.subframeEnabled = true;
var expressionsPlugin = exports.expressionsPlugin = void 0;
var isSafari = exports.isSafari = false;
var cachedColors = exports.cachedColors = {};
var bm_rounder = exports.bm_rounder = Math.round;
var bm_rnd = exports.bm_rnd = void 0;
var bm_pow = exports.bm_pow = Math.pow;
var bm_sqrt = exports.bm_sqrt = Math.sqrt;
var bm_abs = exports.bm_abs = Math.abs;
var bm_floor = exports.bm_floor = Math.floor;
var bm_max = exports.bm_max = Math.max;
var bm_min = exports.bm_min = Math.min;
var blitter = exports.blitter = 10;
var roundCorner = exports.roundCorner = 0.5519;

exports.default = Math;
function RGBtoHSV(r, g, b) {
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var d = max - min;
  var h = void 0;
  var s = max === 0 ? 0 : d / max;
  var v = max / 255;

  switch (max) {
    case min:
      h = 0;break;
    case r:
      h = g - b + d * (g < b ? 6 : 0);h /= 6 * d;break;
    case g:
      h = b - r + d * 2;h /= 6 * d;break;
    case b:
      h = r - g + d * 4;h /= 6 * d;break;
    default:
      break;
  }

  return [h, s, v];
}

function HSVtoRGB(h, s, v) {
  var r = void 0;
  var g = void 0;
  var b = void 0;
  var i = void 0;
  var f = void 0;
  var p = void 0;
  var q = void 0;
  var t = void 0;
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      r = v;g = t;b = p;break;
    case 1:
      r = q;g = v;b = p;break;
    case 2:
      r = p;g = v;b = t;break;
    case 3:
      r = p;g = q;b = v;break;
    case 4:
      r = t;g = p;b = v;break;
    case 5:
      r = v;g = p;b = q;break;
    default:
      break;
  }
  return [r, g, b];
}

function addHueToRGB(color, offset) {
  var hsv = RGBtoHSV(color[0] * 255, color[1] * 255, color[2] * 255);
  hsv[0] += offset / 360;
  if (hsv[0] > 1) {
    hsv[0] -= 1;
  } else if (hsv[0] < 0) {
    hsv[0] += 1;
  }
  return HSVtoRGB(hsv[0], hsv[1], hsv[2]);
}

function addSaturationToRGB(color, offset) {
  var hsv = RGBtoHSV(color[0] * 255, color[1] * 255, color[2] * 255);
  hsv[1] += offset;
  if (hsv[1] > 1) {
    hsv[1] = 1;
  } else if (hsv[1] <= 0) {
    hsv[1] = 0;
  }
  return HSVtoRGB(hsv[0], hsv[1], hsv[2]);
}

function addBrightnessToRGB(color, offset) {
  var hsv = RGBtoHSV(color[0] * 255, color[1] * 255, color[2] * 255);
  hsv[2] += offset;
  if (hsv[2] > 1) {
    hsv[2] = 1;
  } else if (hsv[2] < 0) {
    hsv[2] = 0;
  }
  return HSVtoRGB(hsv[0], hsv[1], hsv[2]);
}

function BMEnterFrameEvent(n, c, t, d) {
  this.type = n;
  this.currentTime = c;
  this.totalTime = t;
  this.direction = d < 0 ? -1 : 1;
}

function BMCompleteEvent(n, d) {
  this.type = n;
  this.direction = d < 0 ? -1 : 1;
}

function BMCompleteLoopEvent(n, c, t, d) {
  this.type = n;
  this.currentLoop = t;
  this.totalLoops = c;
  this.direction = d < 0 ? -1 : 1;
}

function BMSegmentStartEvent(n, f, t) {
  this.type = n;
  this.firstFrame = f;
  this.totalFrames = t;
}

function BMDestroyEvent(n, t) {
  this.type = n;
  this.target = t;
}