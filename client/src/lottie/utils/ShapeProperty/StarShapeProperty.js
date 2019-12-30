'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PropertyFactory = require('../PropertyFactory');

var _PropertyFactory2 = _interopRequireDefault(_PropertyFactory);

var _index = require('./index');

var _shape_pool = require('../pooling/shape_pool');

var _shape_pool2 = _interopRequireDefault(_shape_pool);

var _shapeCollection_pool = require('../pooling/shapeCollection_pool');

var _shapeCollection_pool2 = _interopRequireDefault(_shapeCollection_pool);

var _dynamicProperties = require('../dynamicProperties');

var _dynamicProperties2 = _interopRequireDefault(_dynamicProperties);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var degToRads = Math.PI / 180;

var StarShapeProperty = function (_DynamicPropertyConta) {
  _inherits(StarShapeProperty, _DynamicPropertyConta);

  function StarShapeProperty(elem, data) {
    _classCallCheck(this, StarShapeProperty);

    var _this = _possibleConstructorReturn(this, (StarShapeProperty.__proto__ || Object.getPrototypeOf(StarShapeProperty)).call(this));

    _this.reset = _index.resetShape;

    _this.v = _shape_pool2.default.newElement();
    _this.v.setPathData(true, 0);
    _this.elem = elem;
    _this.comp = elem.comp;
    _this.data = data;
    _this.frameId = -1;
    _this.d = data.d;
    _this.initDynamicPropertyContainer(elem);
    if (data.sy === 1) {
      _this.ir = _PropertyFactory2.default.getProp(elem, data.ir, 0, 0, _this);
      _this.is = _PropertyFactory2.default.getProp(elem, data.is, 0, 0.01, _this);
      _this.convertToPath = _this.convertStarToPath;
    } else {
      _this.convertToPath = _this.convertPolygonToPath;
    }
    _this.pt = _PropertyFactory2.default.getProp(elem, data.pt, 0, 0, _this);
    _this.p = _PropertyFactory2.default.getProp(elem, data.p, 1, 0, _this);
    _this.r = _PropertyFactory2.default.getProp(elem, data.r, 0, degToRads, _this);
    _this.or = _PropertyFactory2.default.getProp(elem, data.or, 0, 0, _this);
    _this.os = _PropertyFactory2.default.getProp(elem, data.os, 0, 0.01, _this);
    _this.localShapeCollection = _shapeCollection_pool2.default.newShapeCollection();
    _this.localShapeCollection.addShape(_this.v);
    _this.paths = _this.localShapeCollection;
    if (_this.dynamicProperties.length) {
      _this.k = true;
    } else {
      _this.k = false;
      _this.convertToPath();
    }
    return _this;
  }

  _createClass(StarShapeProperty, [{
    key: 'getValue',
    value: function getValue() {
      if (this.elem.globalData.frameId === this.frameId) {
        return;
      }
      this.frameId = this.elem.globalData.frameId;
      this.iterateDynamicProperties();
      if (this._mdf) {
        this.convertToPath();
      }
    }
  }, {
    key: 'convertStarToPath',
    value: function convertStarToPath() {
      var numPts = Math.floor(this.pt.v) * 2;
      var angle = Math.PI * 2 / numPts;
      /* this.v.v.length = numPts;
      this.v.i.length = numPts;
      this.v.o.length = numPts; */
      var longFlag = true;
      var longRad = this.or.v;
      var shortRad = this.ir.v;
      var longRound = this.os.v;
      var shortRound = this.is.v;
      var longPerimSegment = 2 * Math.PI * longRad / (numPts * 2);
      var shortPerimSegment = 2 * Math.PI * shortRad / (numPts * 2);
      var i = void 0;
      var rad = void 0;
      var roundness = void 0;
      var perimSegment = void 0;
      var currentAng = -Math.PI / 2;
      currentAng += this.r.v;
      var dir = this.data.d === 3 ? -1 : 1;
      this.v._length = 0;
      for (i = 0; i < numPts; i += 1) {
        rad = longFlag ? longRad : shortRad;
        roundness = longFlag ? longRound : shortRound;
        perimSegment = longFlag ? longPerimSegment : shortPerimSegment;
        var x = rad * Math.cos(currentAng);
        var y = rad * Math.sin(currentAng);
        var ox = x === 0 && y === 0 ? 0 : y / Math.sqrt(x * x + y * y);
        var oy = x === 0 && y === 0 ? 0 : -x / Math.sqrt(x * x + y * y);
        x += +this.p.v[0];
        y += +this.p.v[1];
        this.v.setTripleAt(x, y, x - ox * perimSegment * roundness * dir, y - oy * perimSegment * roundness * dir, x + ox * perimSegment * roundness * dir, y + oy * perimSegment * roundness * dir, i, true);

        /* this.v.v[i] = [x,y];
        this.v.i[i] = [x+ox*perimSegment*roundness*dir,y+oy*perimSegment*roundness*dir];
        this.v.o[i] = [x-ox*perimSegment*roundness*dir,y-oy*perimSegment*roundness*dir];
        this.v._length = numPts; */
        longFlag = !longFlag;
        currentAng += angle * dir;
      }
    }
  }, {
    key: 'convertPolygonToPath',
    value: function convertPolygonToPath() {
      var numPts = Math.floor(this.pt.v);
      var angle = Math.PI * 2 / numPts;
      var rad = this.or.v;
      var roundness = this.os.v;
      var perimSegment = 2 * Math.PI * rad / (numPts * 4);
      var i = void 0;
      var currentAng = -Math.PI / 2;
      var dir = this.data.d === 3 ? -1 : 1;
      currentAng += this.r.v;
      this.v._length = 0;
      for (i = 0; i < numPts; i += 1) {
        var x = rad * Math.cos(currentAng);
        var y = rad * Math.sin(currentAng);
        var ox = x === 0 && y === 0 ? 0 : y / Math.sqrt(x * x + y * y);
        var oy = x === 0 && y === 0 ? 0 : -x / Math.sqrt(x * x + y * y);
        x += +this.p.v[0];
        y += +this.p.v[1];
        this.v.setTripleAt(x, y, x - ox * perimSegment * roundness * dir, y - oy * perimSegment * roundness * dir, x + ox * perimSegment * roundness * dir, y + oy * perimSegment * roundness * dir, i, true);
        currentAng += angle * dir;
      }
      this.paths.length = 0;
      this.paths[0] = this.v;
    }
  }]);

  return StarShapeProperty;
}(_dynamicProperties2.default);

exports.default = StarShapeProperty;