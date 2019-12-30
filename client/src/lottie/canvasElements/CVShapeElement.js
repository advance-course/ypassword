'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transformationMatrix = require('../3rd_party/transformation-matrix');

var _transformationMatrix2 = _interopRequireDefault(_transformationMatrix);

var _PropertyFactory = require('../utils/PropertyFactory');

var _PropertyFactory2 = _interopRequireDefault(_PropertyFactory);

var _TransformProperty = require('../utils/TransformProperty');

var _TransformProperty2 = _interopRequireDefault(_TransformProperty);

var _CVShapeData = require('../shapes/CVShapeData');

var _CVShapeData2 = _interopRequireDefault(_CVShapeData);

var _mixin = require('../utils/mixin');

var _mixin2 = _interopRequireDefault(_mixin);

var _CVBaseElement = require('../canvasElements/CVBaseElement');

var _CVBaseElement2 = _interopRequireDefault(_CVBaseElement);

var _BaseElement = require('../elements/BaseElement');

var _BaseElement2 = _interopRequireDefault(_BaseElement);

var _TransformElement = require('../elements/TransformElement');

var _TransformElement2 = _interopRequireDefault(_TransformElement);

var _ShapeElement = require('../elements/ShapeElement');

var _ShapeElement2 = _interopRequireDefault(_ShapeElement);

var _HierarchyElement = require('../elements/HierarchyElement');

var _HierarchyElement2 = _interopRequireDefault(_HierarchyElement);

var _FrameElement = require('../elements/FrameElement');

var _FrameElement2 = _interopRequireDefault(_FrameElement);

var _RenderableElement = require('../elements/RenderableElement');

var _RenderableElement2 = _interopRequireDefault(_RenderableElement);

var _common = require('../utils/common');

var _DashProperty = require('../shapes/DashProperty');

var _DashProperty2 = _interopRequireDefault(_DashProperty);

var _ShapeModifiers = require('../shapes/ShapeModifiers');

var _ShapeModifiers2 = _interopRequireDefault(_ShapeModifiers);

var _RoundCornersModifier = require('../shapes/RoundCornersModifier');

var _RoundCornersModifier2 = _interopRequireDefault(_RoundCornersModifier);

var _MouseModifier = require('../shapes/MouseModifier');

var _MouseModifier2 = _interopRequireDefault(_MouseModifier);

var _RepeaterModifier = require('../shapes/RepeaterModifier');

var _RepeaterModifier2 = _interopRequireDefault(_RepeaterModifier);

var _TrimModifier = require('../shapes/TrimModifier');

var _TrimModifier2 = _interopRequireDefault(_TrimModifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

_ShapeModifiers2.default.registerModifier('rd', _RoundCornersModifier2.default);
_ShapeModifiers2.default.registerModifier('ms', _MouseModifier2.default);
_ShapeModifiers2.default.registerModifier('rp', _RepeaterModifier2.default);
_ShapeModifiers2.default.registerModifier('tm', _TrimModifier2.default);

var CVShapeElement = function (_Mixin) {
  _inherits(CVShapeElement, _Mixin);

  function CVShapeElement(data, globalData, comp) {
    _classCallCheck(this, CVShapeElement);

    var _this = _possibleConstructorReturn(this, (CVShapeElement.__proto__ || Object.getPrototypeOf(CVShapeElement)).call(this));

    _this.transformHelper = {
      opacity: 1,
      mat: new _transformationMatrix2.default(),
      _matMdf: false,
      _opMdf: false
    };
    _this.dashResetter = [];

    _this.shapes = [];
    _this.shapesData = data.shapes;
    _this.stylesList = [];
    _this.itemsData = [];
    _this.prevViewData = [];
    _this.shapeModifiers = [];
    _this.processedElements = [];
    _this.initElement(data, globalData, comp);
    return _this;
  }

  _createClass(CVShapeElement, [{
    key: 'initElement',
    value: function initElement(data, globalData, comp) {
      this.initFrame();
      this.initBaseData(data, globalData, comp);
      this.initTransform(data, globalData, comp);
      this.initHierarchy();
      this.initRenderable();
      this.initRendererElement();
      this.createContainerElements();
      this.addMasks();
      this.createContent();
      this.hide();
    }
  }, {
    key: 'createContent',
    value: function createContent() {
      this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, true);
    }
  }, {
    key: 'createStyleElement',
    value: function createStyleElement(data) {
      var styleElem = {
        data: data,
        type: data.ty,
        elements: []
      };
      var elementData = {};
      if (data.ty === 'fl' || data.ty === 'st') {
        elementData.c = _PropertyFactory2.default.getProp(this, data.c, 1, 255, this);
        if (!elementData.c.k) {
          styleElem.co = 'rgb(' + (0, _common.bm_floor)(elementData.c.v[0]) + ',' + (0, _common.bm_floor)(elementData.c.v[1]) + ',' + (0, _common.bm_floor)(elementData.c.v[2]) + ')';
        }
      }
      elementData.o = _PropertyFactory2.default.getProp(this, data.o, 0, 0.01, this);
      if (data.ty === 'st') {
        styleElem.lc = this.lcEnum[data.lc] || 'round';
        styleElem.lj = this.ljEnum[data.lj] || 'round';
        if (data.lj === 1) {
          styleElem.ml = data.ml;
        }
        elementData.w = _PropertyFactory2.default.getProp(this, data.w, 0, null, this);
        if (!elementData.w.k) {
          styleElem.wi = elementData.w.v;
        }
        if (data.d) {
          var d = new _DashProperty2.default(this, data.d, 'canvas');
          elementData.d = d;
          if (!elementData.d.k) {
            styleElem.da = elementData.d.dashArray;
            styleElem.do = elementData.d.dashoffset[0];
          }
        }
      } else {
        styleElem.r = data.r === 2 ? 'evenodd' : 'nonzero';
      }
      this.stylesList.push(styleElem);
      elementData.style = styleElem;
      return elementData;
    }
  }, {
    key: 'createGroupElement',
    value: function createGroupElement() {
      var elementData = {
        it: [],
        prevViewData: []
      };
      return elementData;
    }
  }, {
    key: 'createTransformElement',
    value: function createTransformElement(data) {
      var elementData = {
        transform: {
          mat: new _transformationMatrix2.default(),
          opacity: 1,
          _matMdf: false,
          _opMdf: false,
          op: _PropertyFactory2.default.getProp(this, data.o, 0, 0.01, this),
          mProps: _TransformProperty2.default.getTransformProperty(this, data, this)
        },
        elements: []
      };
      return elementData;
    }
  }, {
    key: 'createShapeElement',
    value: function createShapeElement(data) {
      var elementData = new _CVShapeData2.default(this, data);

      this.shapes.push(elementData);
      this.addShapeToModifiers(elementData);
      var j = void 0;
      var jLen = this.stylesList.length;
      var hasStrokes = false;
      var hasFills = false;
      for (j = 0; j < jLen; j += 1) {
        if (!this.stylesList[j].closed) {
          this.stylesList[j].elements.push(elementData);
          if (this.stylesList[j].type === 'st') {
            hasStrokes = true;
          } else {
            hasFills = true;
          }
        }
      }
      elementData.st = hasStrokes;
      elementData.fl = hasFills;
      return elementData;
    }
  }, {
    key: 'reloadShapes',
    value: function reloadShapes() {
      this._isFirstFrame = true;
      var i = void 0;
      var len = this.itemsData.length;
      for (i = 0; i < len; i += 1) {
        this.prevViewData[i] = this.itemsData[i];
      }
      this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, true);
      len = this.dynamicProperties.length;
      for (i = 0; i < len; i += 1) {
        this.dynamicProperties[i].getValue();
      }
      this.renderModifiers();
    }
  }, {
    key: 'searchShapes',
    value: function searchShapes(arr, itemsData, prevViewData, render) {
      var i = void 0;
      var len = arr.length - 1;
      var j = void 0;
      var jLen = void 0;
      var ownArrays = [];
      var ownModifiers = [];
      var processedPos = void 0;
      var modifier = void 0;
      for (i = len; i >= 0; i -= 1) {
        processedPos = this.searchProcessedElement(arr[i]);
        if (!processedPos) {
          arr[i]._render = render;
        } else {
          itemsData[i] = prevViewData[processedPos - 1];
        }
        if (arr[i].ty === 'fl' || arr[i].ty === 'st') {
          if (!processedPos) {
            itemsData[i] = this.createStyleElement(arr[i]);
          } else {
            itemsData[i].style.closed = false;
          }

          ownArrays.push(itemsData[i].style);
        } else if (arr[i].ty === 'gr') {
          if (!processedPos) {
            itemsData[i] = this.createGroupElement(arr[i]);
          } else {
            jLen = itemsData[i].it.length;
            for (j = 0; j < jLen; j += 1) {
              itemsData[i].prevViewData[j] = itemsData[i].it[j];
            }
          }
          this.searchShapes(arr[i].it, itemsData[i].it, itemsData[i].prevViewData, render);
        } else if (arr[i].ty === 'tr') {
          if (!processedPos) {
            itemsData[i] = this.createTransformElement(arr[i]);
          }
        } else if (arr[i].ty === 'sh' || arr[i].ty === 'rc' || arr[i].ty === 'el' || arr[i].ty === 'sr') {
          if (!processedPos) {
            itemsData[i] = this.createShapeElement(arr[i]);
          }
        } else if (arr[i].ty === 'tm' || arr[i].ty === 'rd') {
          if (!processedPos) {
            modifier = _ShapeModifiers2.default.getModifier(arr[i].ty);
            modifier.init(this, arr[i]);
            itemsData[i] = modifier;
            this.shapeModifiers.push(modifier);
          } else {
            modifier = itemsData[i];
            modifier.closed = false;
          }
          ownModifiers.push(modifier);
        } else if (arr[i].ty === 'rp') {
          if (!processedPos) {
            modifier = _ShapeModifiers2.default.getModifier(arr[i].ty);
            itemsData[i] = modifier;
            modifier.init(this, arr, i, itemsData);
            this.shapeModifiers.push(modifier);
            render = false;
          } else {
            modifier = itemsData[i];
            modifier.closed = true;
          }
          ownModifiers.push(modifier);
        }
        this.addProcessedElement(arr[i], i + 1);
      }
      len = ownArrays.length;
      for (i = 0; i < len; i += 1) {
        ownArrays[i].closed = true;
      }
      len = ownModifiers.length;
      for (i = 0; i < len; i += 1) {
        ownModifiers[i].closed = true;
      }
    }
  }, {
    key: 'renderInnerContent',
    value: function renderInnerContent() {
      this.transformHelper.mat.reset();
      this.transformHelper.opacity = 1;
      this.transformHelper._matMdf = false;
      this.transformHelper._opMdf = false;
      this.renderModifiers();
      this.renderShape(this.transformHelper, this.shapesData, this.itemsData, true);
    }
  }, {
    key: 'renderShapeTransform',
    value: function renderShapeTransform(parentTransform, groupTransform) {
      var props = void 0;
      var groupMatrix = void 0;
      if (parentTransform._opMdf || groupTransform.op._mdf || this._isFirstFrame) {
        groupTransform.opacity = parentTransform.opacity;
        groupTransform.opacity *= groupTransform.op.v;
        groupTransform._opMdf = true;
      }
      if (parentTransform._matMdf || groupTransform.mProps._mdf || this._isFirstFrame) {
        groupMatrix = groupTransform.mat;
        groupMatrix.cloneFromProps(groupTransform.mProps.v.props);
        groupTransform._matMdf = true;
        props = parentTransform.mat.props;
        groupMatrix.transform(props[0], props[1], props[2], props[3], props[4], props[5], props[6], props[7], props[8], props[9], props[10], props[11], props[12], props[13], props[14], props[15]);
      }
    }
  }, {
    key: 'drawLayer',
    value: function drawLayer() {
      var i = void 0;
      var len = this.stylesList.length;
      var j = void 0;
      var jLen = void 0;
      var k = void 0;
      var kLen = void 0;
      var elems = void 0;
      var nodes = void 0;
      var renderer = this.globalData.renderer;
      var ctx = this.globalData.canvasContext;
      var type = void 0;
      var currentStyle = void 0;

      // const isFirstFrame = this._isFirstFrame;

      for (i = 0; i < len; i += 1) {
        currentStyle = this.stylesList[i];
        type = currentStyle.type;
        if (type === 'st' && currentStyle.wi === 0 || !currentStyle.data._render || currentStyle.coOp === 0) {
          continue;
        }
        renderer.save();
        elems = currentStyle.elements;
        if (type === 'st') {
          ctx.setStrokeStyle(currentStyle.co);
          ctx.setLineWidth(currentStyle.wi);
          ctx.setLineCap(currentStyle.lc);
          ctx.setLineJoin(currentStyle.lj);
          ctx.setMiterLimit(currentStyle.ml || 0);
        } else {
          ctx.setFillStyle(currentStyle.co);
        }
        renderer.ctxOpacity(currentStyle.coOp);
        if (this.globalData.currentGlobalAlpha !== 0) {
          if (type !== 'st') {
            ctx.beginPath();
          }
          jLen = elems.length;
          for (j = 0; j < jLen; j += 1) {
            if (type === 'st') {
              ctx.beginPath();
              if (currentStyle.da) {
                ctx.setLineDash(currentStyle.da);
                ctx.lineDashOffset = currentStyle.do;
                this.globalData.isDashed = true;
              } else if (this.globalData.isDashed) {
                ctx.setLineDash(this.dashResetter);
                this.globalData.isDashed = false;
              }
            }
            nodes = elems[j].trNodes;
            kLen = nodes.length;

            for (k = 0; k < kLen; k += 1) {
              if (nodes[k].t === 'm') {
                ctx.moveTo(nodes[k].p[0], nodes[k].p[1]);
              } else if (nodes[k].t === 'c') {
                ctx.bezierCurveTo(nodes[k].pts[0], nodes[k].pts[1], nodes[k].pts[2], nodes[k].pts[3], nodes[k].pts[4], nodes[k].pts[5]);
              } else {
                ctx.closePath();
              }
            }
            if (type === 'st') {
              ctx.stroke();
              // ctx.draw(true);
            }
          }
          if (type !== 'st') {
            ctx.fill(currentStyle.r);
            // ctx.draw(true);
          }
        }

        renderer.restore();
      }
    }
  }, {
    key: 'renderShape',
    value: function renderShape(parentTransform, items, data, isMain) {
      var i = void 0;
      var len = items.length - 1;
      var groupTransform = void 0;
      groupTransform = parentTransform;
      for (i = len; i >= 0; i -= 1) {
        if (items[i].ty === 'tr') {
          groupTransform = data[i].transform;
          this.renderShapeTransform(parentTransform, groupTransform);
        } else if (items[i].ty === 'sh' || items[i].ty === 'el' || items[i].ty === 'rc' || items[i].ty === 'sr') {
          this.renderPath(items[i], data[i], groupTransform);
        } else if (items[i].ty === 'fl') {
          this.renderFill(items[i], data[i], groupTransform);
        } else if (items[i].ty === 'st') {
          this.renderStroke(items[i], data[i], groupTransform);
        } else if (items[i].ty === 'gr') {
          this.renderShape(groupTransform, items[i].it, data[i].it);
        } else if (items[i].ty === 'tm') {
          //
        }
      }
      if (isMain) {
        this.drawLayer();
      }
    }
  }, {
    key: 'renderPath',
    value: function renderPath(pathData, itemData, groupTransform) {
      var len = void 0;
      var i = void 0;
      var j = void 0;
      var jLen = void 0;
      var redraw = groupTransform._matMdf || itemData.sh._mdf || this._isFirstFrame;
      if (redraw) {
        var paths = itemData.sh.paths;
        var groupTransformMat = groupTransform.mat;
        jLen = pathData._render === false ? 0 : paths._length;
        var pathStringTransformed = itemData.trNodes;
        pathStringTransformed.length = 0;
        for (j = 0; j < jLen; j += 1) {
          var pathNodes = paths.shapes[j];
          if (pathNodes && pathNodes.v) {
            len = pathNodes._length;
            for (i = 1; i < len; i += 1) {
              if (i === 1) {
                pathStringTransformed.push({
                  t: 'm',
                  p: groupTransformMat.applyToPointArray(pathNodes.v[0][0], pathNodes.v[0][1], 0)
                });
              }
              pathStringTransformed.push({
                t: 'c',
                pts: groupTransformMat.applyToTriplePoints(pathNodes.o[i - 1], pathNodes.i[i], pathNodes.v[i])
              });
            }
            if (len === 1) {
              pathStringTransformed.push({
                t: 'm',
                p: groupTransformMat.applyToPointArray(pathNodes.v[0][0], pathNodes.v[0][1], 0)
              });
            }
            if (pathNodes.c && len) {
              pathStringTransformed.push({
                t: 'c',
                pts: groupTransformMat.applyToTriplePoints(pathNodes.o[i - 1], pathNodes.i[0], pathNodes.v[0])
              });
              pathStringTransformed.push({
                t: 'z'
              });
            }
            itemData.lStr = pathStringTransformed;
          }
        }

        if (itemData.st) {
          for (i = 0; i < 16; i += 1) {
            itemData.tr[i] = groupTransform.mat.props[i];
          }
        }
        itemData.trNodes = pathStringTransformed;
      }
    }
  }, {
    key: 'renderFill',
    value: function renderFill(styleData, itemData, groupTransform) {
      var styleElem = itemData.style;

      if (itemData.c._mdf || this._isFirstFrame) {
        styleElem.co = 'rgb(' + (0, _common.bm_floor)(itemData.c.v[0]) + ',' + (0, _common.bm_floor)(itemData.c.v[1]) + ',' + (0, _common.bm_floor)(itemData.c.v[2]) + ')';
      }
      if (itemData.o._mdf || groupTransform._opMdf || this._isFirstFrame) {
        styleElem.coOp = itemData.o.v * groupTransform.opacity;
      }
    }
  }, {
    key: 'renderStroke',
    value: function renderStroke(styleData, itemData, groupTransform) {
      var styleElem = itemData.style;
      var d = itemData.d;
      if (d && (d._mdf || this._isFirstFrame)) {
        styleElem.da = d.dashArray;
        styleElem.do = d.dashoffset[0];
      }
      if (itemData.c._mdf || this._isFirstFrame) {
        styleElem.co = 'rgb(' + (0, _common.bm_floor)(itemData.c.v[0]) + ',' + (0, _common.bm_floor)(itemData.c.v[1]) + ',' + (0, _common.bm_floor)(itemData.c.v[2]) + ')';
      }
      if (itemData.o._mdf || groupTransform._opMdf || this._isFirstFrame) {
        styleElem.coOp = itemData.o.v * groupTransform.opacity;
      }
      if (itemData.w._mdf || this._isFirstFrame) {
        styleElem.wi = itemData.w.v;
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.shapesData = null;
      this.globalData = null;
      this.canvasContext = null;
      this.stylesList.length = 0;
      this.itemsData.length = 0;
    }
  }]);

  return CVShapeElement;
}((0, _mixin2.default)(_BaseElement2.default, _TransformElement2.default, _CVBaseElement2.default, _ShapeElement2.default, _HierarchyElement2.default, _FrameElement2.default, _RenderableElement2.default));

exports.default = CVShapeElement;