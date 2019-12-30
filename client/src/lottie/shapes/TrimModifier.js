'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ShapeModifiers = require('./ShapeModifiers');

var _PropertyFactory = require('../utils/PropertyFactory');

var _PropertyFactory2 = _interopRequireDefault(_PropertyFactory);

var _segments_length_pool = require('../utils/pooling/segments_length_pool');

var _segments_length_pool2 = _interopRequireDefault(_segments_length_pool);

var _bez = require('../utils/bez');

var _bez2 = _interopRequireDefault(_bez);

var _shape_pool = require('../utils/pooling/shape_pool');

var _shape_pool2 = _interopRequireDefault(_shape_pool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TrimModifier = function (_ShapeModifier) {
  _inherits(TrimModifier, _ShapeModifier);

  function TrimModifier() {
    _classCallCheck(this, TrimModifier);

    return _possibleConstructorReturn(this, (TrimModifier.__proto__ || Object.getPrototypeOf(TrimModifier)).apply(this, arguments));
  }

  _createClass(TrimModifier, [{
    key: 'initModifierProperties',
    value: function initModifierProperties(elem, data) {
      this.s = _PropertyFactory2.default.getProp(elem, data.s, 0, 0.01, this);
      this.e = _PropertyFactory2.default.getProp(elem, data.e, 0, 0.01, this);
      this.o = _PropertyFactory2.default.getProp(elem, data.o, 0, 0, this);
      this.sValue = 0;
      this.eValue = 0;
      this.getValue = this.processKeys;
      this.m = data.m;
      this._isAnimated = !!this.s.effectsSequence.length || !!this.e.effectsSequence.length || !!this.o.effectsSequence.length;
    }
  }, {
    key: 'addShapeToModifier',
    value: function addShapeToModifier(shapeData) {
      shapeData.pathsData = [];
    }
  }, {
    key: 'calculateShapeEdges',
    value: function calculateShapeEdges(s, e, shapeLength, addedLength, totalModifierLength) {
      var segments = [];
      if (e <= 1) {
        segments.push({
          s: s,
          e: e
        });
      } else if (s >= 1) {
        segments.push({
          s: s - 1,
          e: e - 1
        });
      } else {
        segments.push({
          s: s,
          e: 1
        });
        segments.push({
          s: 0,
          e: e - 1
        });
      }
      var shapeSegments = [];
      var i = void 0;
      var len = segments.length;
      var segmentOb = void 0;
      for (i = 0; i < len; i += 1) {
        segmentOb = segments[i];
        if (segmentOb.e * totalModifierLength < addedLength || segmentOb.s * totalModifierLength > addedLength + shapeLength) {
          continue;
        } else {
          var shapeS = void 0;
          var shapeE = void 0;
          if (segmentOb.s * totalModifierLength <= addedLength) {
            shapeS = 0;
          } else {
            shapeS = (segmentOb.s * totalModifierLength - addedLength) / shapeLength;
          }
          if (segmentOb.e * totalModifierLength >= addedLength + shapeLength) {
            shapeE = 1;
          } else {
            shapeE = (segmentOb.e * totalModifierLength - addedLength) / shapeLength;
          }
          shapeSegments.push([shapeS, shapeE]);
        }
      }
      if (!shapeSegments.length) {
        shapeSegments.push([0, 0]);
      }
      return shapeSegments;
    }
  }, {
    key: 'releasePathsData',
    value: function releasePathsData(pathsData) {
      var i = void 0;
      var len = pathsData.length;
      for (i = 0; i < len; i += 1) {
        _segments_length_pool2.default.release(pathsData[i]);
      }
      pathsData.length = 0;
      return pathsData;
    }
  }, {
    key: 'processShapes',
    value: function processShapes(_isFirstFrame) {
      var s = void 0;
      var e = void 0;
      if (this._mdf || _isFirstFrame) {
        var o = this.o.v % 360 / 360;
        if (o < 0) {
          o += 1;
        }
        s = this.s.v + o;
        e = this.e.v + o;
        // if (s === e) {
        // }
        if (s > e) {
          var _s = s;
          s = e;
          e = _s;
        }
        s = Math.round(s * 1000) / 1000;
        e = Math.round(e * 1000) / 1000;
        this.sValue = s;
        this.eValue = e;
      } else {
        s = this.sValue;
        e = this.eValue;
      }
      var shapePaths = void 0;
      var i = void 0;
      var len = this.shapes.length;
      var j = void 0;
      var jLen = void 0;
      var pathsData = void 0;
      var pathData = void 0;
      var totalShapeLength = void 0;
      var totalModifierLength = 0;

      if (e === s) {
        for (i = 0; i < len; i += 1) {
          this.shapes[i].localShapeCollection.releaseShapes();
          this.shapes[i].shape._mdf = true;
          this.shapes[i].shape.paths = this.shapes[i].localShapeCollection;
        }
      } else if (!(e === 1 && s === 0 || e === 0 && s === 1)) {
        var segments = [];
        var shapeData = void 0;
        var localShapeCollection = void 0;
        for (i = 0; i < len; i += 1) {
          shapeData = this.shapes[i];
          // if shape hasn't changed and trim properties haven't changed, cached previous path can be used
          if (!shapeData.shape._mdf && !this._mdf && !_isFirstFrame && this.m !== 2) {
            shapeData.shape.paths = shapeData.localShapeCollection;
          } else {
            shapePaths = shapeData.shape.paths;
            jLen = shapePaths._length;
            totalShapeLength = 0;
            if (!shapeData.shape._mdf && shapeData.pathsData.length) {
              totalShapeLength = shapeData.totalShapeLength;
            } else {
              pathsData = this.releasePathsData(shapeData.pathsData);
              for (j = 0; j < jLen; j += 1) {
                pathData = _bez2.default.getSegmentsLength(shapePaths.shapes[j]);
                pathsData.push(pathData);
                totalShapeLength += pathData.totalLength;
              }
              shapeData.totalShapeLength = totalShapeLength;
              shapeData.pathsData = pathsData;
            }

            totalModifierLength += totalShapeLength;
            shapeData.shape._mdf = true;
          }
        }
        var shapeS = s;
        var shapeE = e;
        var addedLength = 0;
        var edges = void 0;
        for (i = len - 1; i >= 0; i -= 1) {
          shapeData = this.shapes[i];
          if (shapeData.shape._mdf) {
            localShapeCollection = shapeData.localShapeCollection;
            localShapeCollection.releaseShapes();
            // if m === 2 means paths are trimmed individually so edges need to be found for this specific shape relative to whoel group
            if (this.m === 2 && len > 1) {
              edges = this.calculateShapeEdges(s, e, shapeData.totalShapeLength, addedLength, totalModifierLength);
              addedLength += shapeData.totalShapeLength;
            } else {
              edges = [[shapeS, shapeE]];
            }
            jLen = edges.length;
            for (j = 0; j < jLen; j += 1) {
              shapeS = edges[j][0];
              shapeE = edges[j][1];
              segments.length = 0;
              if (shapeE <= 1) {
                segments.push({
                  s: shapeData.totalShapeLength * shapeS,
                  e: shapeData.totalShapeLength * shapeE
                });
              } else if (shapeS >= 1) {
                segments.push({
                  s: shapeData.totalShapeLength * (shapeS - 1),
                  e: shapeData.totalShapeLength * (shapeE - 1)
                });
              } else {
                segments.push({
                  s: shapeData.totalShapeLength * shapeS,
                  e: shapeData.totalShapeLength
                });
                segments.push({
                  s: 0,
                  e: shapeData.totalShapeLength * (shapeE - 1)
                });
              }
              var newShapesData = this.addShapes(shapeData, segments[0]);
              if (segments[0].s !== segments[0].e) {
                if (segments.length > 1) {
                  if (shapeData.shape.v.c) {
                    var lastShape = newShapesData.pop();
                    this.addPaths(newShapesData, localShapeCollection);
                    newShapesData = this.addShapes(shapeData, segments[1], lastShape);
                  } else {
                    this.addPaths(newShapesData, localShapeCollection);
                    newShapesData = this.addShapes(shapeData, segments[1]);
                  }
                }
                this.addPaths(newShapesData, localShapeCollection);
              }
            }
            shapeData.shape.paths = localShapeCollection;
          }
        }
      } else if (this._mdf) {
        for (i = 0; i < len; i += 1) {
          this.shapes[i].shape._mdf = true;
        }
      }
    }
  }, {
    key: 'addPaths',
    value: function addPaths(newPaths, localShapeCollection) {
      var i = void 0;
      var len = newPaths.length;
      for (i = 0; i < len; i += 1) {
        localShapeCollection.addShape(newPaths[i]);
      }
    }
  }, {
    key: 'addSegment',
    value: function addSegment(pt1, pt2, pt3, pt4, shapePath, pos, newShape) {
      shapePath.setXYAt(pt2[0], pt2[1], 'o', pos);
      shapePath.setXYAt(pt3[0], pt3[1], 'i', pos + 1);
      if (newShape) {
        shapePath.setXYAt(pt1[0], pt1[1], 'v', pos);
      }
      shapePath.setXYAt(pt4[0], pt4[1], 'v', pos + 1);
    }
  }, {
    key: 'addSegmentFromArray',
    value: function addSegmentFromArray(points, shapePath, pos, newShape) {
      shapePath.setXYAt(points[1], points[5], 'o', pos);
      shapePath.setXYAt(points[2], points[6], 'i', pos + 1);
      if (newShape) {
        shapePath.setXYAt(points[0], points[4], 'v', pos);
      }
      shapePath.setXYAt(points[3], points[7], 'v', pos + 1);
    }
  }, {
    key: 'addShapes',
    value: function addShapes(shapeData, shapeSegment, shapePath) {
      var pathsData = shapeData.pathsData;
      var shapePaths = shapeData.shape.paths.shapes;
      var i = void 0;
      var len = shapeData.shape.paths._length;
      var j = void 0;
      var jLen = void 0;
      var addedLength = 0;
      var currentLengthData = void 0;
      var segmentCount = void 0;
      var lengths = void 0;
      var segment = void 0;
      var shapes = [];
      var initPos = void 0;
      var newShape = true;
      if (!shapePath) {
        shapePath = _shape_pool2.default.newElement();
        segmentCount = 0;
        initPos = 0;
      } else {
        segmentCount = shapePath._length;
        initPos = shapePath._length;
      }
      shapes.push(shapePath);
      for (i = 0; i < len; i += 1) {
        lengths = pathsData[i].lengths;
        shapePath.c = shapePaths[i].c;
        jLen = shapePaths[i].c ? lengths.length : lengths.length + 1;
        for (j = 1; j < jLen; j += 1) {
          currentLengthData = lengths[j - 1];
          if (addedLength + currentLengthData.addedLength < shapeSegment.s) {
            addedLength += currentLengthData.addedLength;
            shapePath.c = false;
          } else if (addedLength > shapeSegment.e) {
            shapePath.c = false;
            break;
          } else {
            if (shapeSegment.s <= addedLength && shapeSegment.e >= addedLength + currentLengthData.addedLength) {
              this.addSegment(shapePaths[i].v[j - 1], shapePaths[i].o[j - 1], shapePaths[i].i[j], shapePaths[i].v[j], shapePath, segmentCount, newShape);
              newShape = false;
            } else {
              segment = _bez2.default.getNewSegment(shapePaths[i].v[j - 1], shapePaths[i].v[j], shapePaths[i].o[j - 1], shapePaths[i].i[j], (shapeSegment.s - addedLength) / currentLengthData.addedLength, (shapeSegment.e - addedLength) / currentLengthData.addedLength, lengths[j - 1]);
              this.addSegmentFromArray(segment, shapePath, segmentCount, newShape);
              // this.addSegment(segment.pt1, segment.pt3, segment.pt4, segment.pt2, shapePath, segmentCount, newShape);
              newShape = false;
              shapePath.c = false;
            }
            addedLength += currentLengthData.addedLength;
            segmentCount += 1;
          }
        }
        if (shapePaths[i].c) {
          currentLengthData = lengths[j - 1];
          if (addedLength <= shapeSegment.e) {
            var segmentLength = lengths[j - 1].addedLength;
            if (shapeSegment.s <= addedLength && shapeSegment.e >= addedLength + segmentLength) {
              this.addSegment(shapePaths[i].v[j - 1], shapePaths[i].o[j - 1], shapePaths[i].i[0], shapePaths[i].v[0], shapePath, segmentCount, newShape);
              newShape = false;
            } else {
              segment = _bez2.default.getNewSegment(shapePaths[i].v[j - 1], shapePaths[i].v[0], shapePaths[i].o[j - 1], shapePaths[i].i[0], (shapeSegment.s - addedLength) / segmentLength, (shapeSegment.e - addedLength) / segmentLength, lengths[j - 1]);
              this.addSegmentFromArray(segment, shapePath, segmentCount, newShape);
              // this.addSegment(segment.pt1, segment.pt3, segment.pt4, segment.pt2, shapePath, segmentCount, newShape);
              newShape = false;
              shapePath.c = false;
            }
          } else {
            shapePath.c = false;
          }
          addedLength += currentLengthData.addedLength;
          segmentCount += 1;
        }
        if (shapePath._length) {
          shapePath.setXYAt(shapePath.v[initPos][0], shapePath.v[initPos][1], 'i', initPos);
          shapePath.setXYAt(shapePath.v[shapePath._length - 1][0], shapePath.v[shapePath._length - 1][1], 'o', shapePath._length - 1);
        }
        if (addedLength > shapeSegment.e) {
          break;
        }
        if (i < len - 1) {
          shapePath = _shape_pool2.default.newElement();
          newShape = true;
          shapes.push(shapePath);
          segmentCount = 0;
        }
      }
      return shapes;
    }
  }]);

  return TrimModifier;
}(_ShapeModifiers.ShapeModifier);

exports.default = TrimModifier;