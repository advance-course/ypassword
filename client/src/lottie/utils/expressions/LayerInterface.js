'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (elem) {
  var transformInterface = void 0;

  function thisLayerFunction(name) {
    switch (name) {
      case 'ADBE Root Vectors Group':
      case 'Contents':
      case 2:
        return thisLayerFunction.shapeInterface;
      case 1:
      case 6:
      case 'Transform':
      case 'transform':
      case 'ADBE Transform Group':
        return transformInterface;
      case 4:
      case 'ADBE Effect Parade':
        return thisLayerFunction.effect;
      default:
        break;
    }
  }
  function _registerMaskInterface(maskManager) {
    thisLayerFunction.mask = new _MaskInterface2.default(maskManager, elem);
  }
  function _registerEffectsInterface(effects) {
    thisLayerFunction.effect = effects;
  }
  thisLayerFunction.toWorld = toWorld;
  thisLayerFunction.fromWorld = fromWorld;
  thisLayerFunction.toComp = toWorld;
  thisLayerFunction.fromComp = fromComp;
  thisLayerFunction.sampleImage = sampleImage;
  thisLayerFunction.sourceRectAtTime = elem.sourceRectAtTime.bind(elem);
  thisLayerFunction._elem = elem;
  transformInterface = (0, _TransformInterface2.default)(elem.finalTransform.mProp);
  var anchorPointDescriptor = (0, _index.getDescriptor)(transformInterface, 'anchorPoint');
  Object.defineProperties(thisLayerFunction, {
    hasParent: {
      get: function get() {
        return elem.hierarchy.length;
      }
    },
    parent: {
      get: function get() {
        return elem.hierarchy[0].layerInterface;
      }
    },
    rotation: (0, _index.getDescriptor)(transformInterface, 'rotation'),
    scale: (0, _index.getDescriptor)(transformInterface, 'scale'),
    position: (0, _index.getDescriptor)(transformInterface, 'position'),
    opacity: (0, _index.getDescriptor)(transformInterface, 'opacity'),
    anchorPoint: anchorPointDescriptor,
    anchor_point: anchorPointDescriptor,
    transform: {
      get: function get() {
        return transformInterface;
      }
    },
    active: {
      get: function get() {
        return elem.isInRange;
      }
    }
  });

  thisLayerFunction.startTime = elem.data.st;
  thisLayerFunction.index = elem.data.ind;
  thisLayerFunction.source = elem.data.refId;
  thisLayerFunction.height = elem.data.ty === 0 ? elem.data.h : 100;
  thisLayerFunction.width = elem.data.ty === 0 ? elem.data.w : 100;

  thisLayerFunction.registerMaskInterface = _registerMaskInterface;
  thisLayerFunction.registerEffectsInterface = _registerEffectsInterface;
  return thisLayerFunction;
};

var _transformationMatrix = require('../../3rd_party/transformation-matrix');

var _transformationMatrix2 = _interopRequireDefault(_transformationMatrix);

var _MaskInterface = require('./MaskInterface');

var _MaskInterface2 = _interopRequireDefault(_MaskInterface);

var _TransformInterface = require('./TransformInterface');

var _TransformInterface2 = _interopRequireDefault(_TransformInterface);

var _index = require('../index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toWorld(arr, time) {
  var toWorldMat = new _transformationMatrix2.default();
  toWorldMat.reset();
  var transformMat = void 0;
  if (time) {
    // Todo implement value at time on transform properties
    // transformMat = this._elem.finalTransform.mProp.getValueAtTime(time);
    transformMat = this._elem.finalTransform.mProp;
  } else {
    transformMat = this._elem.finalTransform.mProp;
  }
  transformMat.applyToMatrix(toWorldMat);
  if (this._elem.hierarchy && this._elem.hierarchy.length) {
    var i = void 0;
    var len = this._elem.hierarchy.length;
    for (i = 0; i < len; i += 1) {
      this._elem.hierarchy[i].finalTransform.mProp.applyToMatrix(toWorldMat);
    }
    return toWorldMat.applyToPointArray(arr[0], arr[1], arr[2] || 0);
  }
  return toWorldMat.applyToPointArray(arr[0], arr[1], arr[2] || 0);
}
function fromWorld(arr, time) {
  var toWorldMat = new _transformationMatrix2.default();
  toWorldMat.reset();
  var transformMat = void 0;
  if (time) {
    // Todo implement value at time on transform properties
    // transformMat = this._elem.finalTransform.mProp.getValueAtTime(time);
    transformMat = this._elem.finalTransform.mProp;
  } else {
    transformMat = this._elem.finalTransform.mProp;
  }
  transformMat.applyToMatrix(toWorldMat);
  if (this._elem.hierarchy && this._elem.hierarchy.length) {
    var i = void 0;
    var len = this._elem.hierarchy.length;
    for (i = 0; i < len; i += 1) {
      this._elem.hierarchy[i].finalTransform.mProp.applyToMatrix(toWorldMat);
    }
    return toWorldMat.inversePoint(arr);
  }
  return toWorldMat.inversePoint(arr);
}
function fromComp(arr) {
  var toWorldMat = new _transformationMatrix2.default();
  toWorldMat.reset();
  this._elem.finalTransform.mProp.applyToMatrix(toWorldMat);
  if (this._elem.hierarchy && this._elem.hierarchy.length) {
    var i = void 0;
    var len = this._elem.hierarchy.length;
    for (i = 0; i < len; i += 1) {
      this._elem.hierarchy[i].finalTransform.mProp.applyToMatrix(toWorldMat);
    }
    return toWorldMat.inversePoint(arr);
  }
  return toWorldMat.inversePoint(arr);
}

function sampleImage() {
  return [1, 1, 1, 1];
}