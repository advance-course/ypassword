'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../utils/index');

var _ShapePropertyFactory = require('../utils/ShapePropertyFactory');

var _ShapePropertyFactory2 = _interopRequireDefault(_ShapePropertyFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CVMaskElement = function () {
  function CVMaskElement(data, element) {
    _classCallCheck(this, CVMaskElement);

    _initialiseProps.call(this);

    this.data = data;
    this.element = element;
    this.masksProperties = this.data.masksProperties || [];
    this.viewData = (0, _index.createSizedArray)(this.masksProperties.length);
    var i = void 0;
    var len = this.masksProperties.length;
    var hasMasks = false;
    for (i = 0; i < len; i++) {
      if (this.masksProperties[i].mode !== 'n') {
        hasMasks = true;
      }
      this.viewData[i] = _ShapePropertyFactory2.default.getShapeProp(this.element, this.masksProperties[i], 3);
    }
    this.hasMasks = hasMasks;
    if (hasMasks) {
      this.element.addRenderableComponent(this);
    }
  }

  _createClass(CVMaskElement, [{
    key: 'getMaskProperty',
    value: function getMaskProperty(pos) {
      return this.viewData[pos].prop;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.element = null;
    }
  }]);

  return CVMaskElement;
}();

var _initialiseProps = function _initialiseProps() {
  this.renderFrame = function () {
    if (!this.hasMasks) {
      return;
    }
    var transform = this.element.finalTransform.mat;
    var ctx = this.element.canvasContext;
    var i = void 0;
    var len = this.masksProperties.length;
    var pt = void 0;
    var pts = void 0;
    var data = void 0;
    ctx.beginPath();
    for (i = 0; i < len; i++) {
      if (this.masksProperties[i].mode !== 'n') {
        if (this.masksProperties[i].inv) {
          ctx.moveTo(0, 0);
          ctx.lineTo(this.element.globalData.compSize.w, 0);
          ctx.lineTo(this.element.globalData.compSize.w, this.element.globalData.compSize.h);
          ctx.lineTo(0, this.element.globalData.compSize.h);
          ctx.lineTo(0, 0);
        }
        data = this.viewData[i].v;
        pt = transform.applyToPointArray(data.v[0][0], data.v[0][1], 0);
        ctx.moveTo(pt[0], pt[1]);
        var j = void 0;
        var jLen = data._length;
        for (j = 1; j < jLen; j++) {
          pts = transform.applyToTriplePoints(data.o[j - 1], data.i[j], data.v[j]);
          ctx.bezierCurveTo(pts[0], pts[1], pts[2], pts[3], pts[4], pts[5]);
        }
        pts = transform.applyToTriplePoints(data.o[j - 1], data.i[0], data.v[0]);
        ctx.bezierCurveTo(pts[0], pts[1], pts[2], pts[3], pts[4], pts[5]);
      }
    }
    this.element.globalData.renderer.save(true);
    ctx.clip();
    // ctx.draw(true);
  };
};

exports.default = CVMaskElement;