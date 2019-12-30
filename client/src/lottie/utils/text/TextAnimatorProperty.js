'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../index');

var _PropertyFactory = require('../PropertyFactory');

var _PropertyFactory2 = _interopRequireDefault(_PropertyFactory);

var _TextAnimatorDataProperty = require('./TextAnimatorDataProperty');

var _TextAnimatorDataProperty2 = _interopRequireDefault(_TextAnimatorDataProperty);

var _bez = require('../bez');

var _bez2 = _interopRequireDefault(_bez);

var _common = require('../common');

var _LetterProps = require('../LetterProps');

var _LetterProps2 = _interopRequireDefault(_LetterProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextAnimatorProperty = function () {
  function TextAnimatorProperty(textData, renderType, elem) {
    _classCallCheck(this, TextAnimatorProperty);

    this._mdf = false;
    this._isFirstFrame = true;
    this._hasMaskedPath = false;
    this._frameId = -1;
    this.dynamicProperties = [];
    this._textData = textData;
    this._renderType = renderType;
    this._elem = elem;
    this.container = elem;
    this._animatorsData = (0, _index.createSizedArray)(this._textData.a.length);
    this._pathData = {};
    this._moreOptions = {
      alignment: {}
    };
    this.renderedLetters = [];
    this.lettersChangedFlag = false;
  }

  _createClass(TextAnimatorProperty, [{
    key: 'addDynamicProperty',
    value: function addDynamicProperty() {
      console.log('see:', 'https://github.com/airbnb/lottie-web/blob/adb67aaed3058a331d93fe0b87df5129f9fcab57/player/js/utils/text/TextAnimatorProperty.js#L21:53');
    }
  }, {
    key: 'searchProperties',
    value: function searchProperties() {
      var i = void 0;
      var len = this._textData.a.length;
      var animatorProps = void 0;
      var getProp = _PropertyFactory2.default.getProp;
      for (i = 0; i < len; i += 1) {
        animatorProps = this._textData.a[i];
        this._animatorsData[i] = new _TextAnimatorDataProperty2.default(this._elem, animatorProps, this);
      }
      if (this._textData.p && 'm' in this._textData.p) {
        this._pathData = {
          f: getProp(this._elem, this._textData.p.f, 0, 0, this),
          l: getProp(this._elem, this._textData.p.l, 0, 0, this),
          r: this._textData.p.r,
          m: this._elem.maskManager.getMaskProperty(this._textData.p.m)
        };
        this._hasMaskedPath = true;
      } else {
        this._hasMaskedPath = false;
      }
      this._moreOptions.alignment = getProp(this._elem, this._textData.m.a, 1, 0, this);
    }
  }, {
    key: 'getMeasures',
    value: function getMeasures(documentData, lettersChangedFlag) {
      this.lettersChangedFlag = lettersChangedFlag;
      if (!this._mdf && !this._isFirstFrame && !lettersChangedFlag && (!this._hasMaskedPath || !this._pathData.m._mdf)) {
        return;
      }
      this._isFirstFrame = false;
      var alignment = this._moreOptions.alignment.v;
      var animators = this._animatorsData;
      var textData = this._textData;
      var matrixHelper = this.mHelper;
      var renderType = this._renderType;
      var renderedLettersCount = this.renderedLetters.length;
      // let data = this.data;
      var xPos = void 0;
      var yPos = void 0;
      var i = void 0;
      var len = void 0;
      var letters = documentData.l;
      var pathInfo = void 0;
      var currentLength = void 0;
      var currentPoint = void 0;
      var segmentLength = void 0;
      var flag = void 0;
      var pointInd = void 0;
      var segmentInd = void 0;
      var prevPoint = void 0;
      var points = void 0;
      var segments = void 0;
      var partialLength = void 0;
      var totalLength = void 0;
      var perc = void 0;
      var tanAngle = void 0;
      var mask = void 0;
      if (this._hasMaskedPath) {
        mask = this._pathData.m;
        if (!this._pathData.n || this._pathData._mdf) {
          var paths = mask.v;
          if (this._pathData.r) {
            paths = paths.reverse();
          }
          // TODO: release bezier data cached from previous pathInfo: this._pathData.pi
          pathInfo = {
            tLength: 0,
            segments: []
          };
          len = paths._length - 1;
          var pathData = void 0;
          totalLength = 0;
          for (i = 0; i < len; i += 1) {
            pathData = {
              s: paths.v[i],
              e: paths.v[i + 1],
              to: [paths.o[i][0] - paths.v[i][0], paths.o[i][1] - paths.v[i][1]],
              ti: [paths.i[i + 1][0] - paths.v[i + 1][0], paths.i[i + 1][1] - paths.v[i + 1][1]]
            };
            _bez2.default.buildBezierData(pathData);
            pathInfo.tLength += pathData.bezierData.segmentLength;
            pathInfo.segments.push(pathData);
            totalLength += pathData.bezierData.segmentLength;
          }
          i = len;
          if (mask.v.c) {
            pathData = {
              s: paths.v[i],
              e: paths.v[0],
              to: [paths.o[i][0] - paths.v[i][0], paths.o[i][1] - paths.v[i][1]],
              ti: [paths.i[0][0] - paths.v[0][0], paths.i[0][1] - paths.v[0][1]]
            };
            _bez2.default.buildBezierData(pathData);
            pathInfo.tLength += pathData.bezierData.segmentLength;
            pathInfo.segments.push(pathData);
            totalLength += pathData.bezierData.segmentLength;
          }
          this._pathData.pi = pathInfo;
        }
        pathInfo = this._pathData.pi;

        currentLength = this._pathData.f.v;
        segmentInd = 0;
        pointInd = 1;
        segmentLength = 0;
        flag = true;
        segments = pathInfo.segments;
        if (currentLength < 0 && mask.v.c) {
          if (pathInfo.tLength < Math.abs(currentLength)) {
            currentLength = -Math.abs(currentLength) % pathInfo.tLength;
          }
          segmentInd = segments.length - 1;
          points = segments[segmentInd].bezierData.points;
          pointInd = points.length - 1;
          while (currentLength < 0) {
            currentLength += points[pointInd].partialLength;
            pointInd -= 1;
            if (pointInd < 0) {
              segmentInd -= 1;
              points = segments[segmentInd].bezierData.points;
              pointInd = points.length - 1;
            }
          }
        }
        points = segments[segmentInd].bezierData.points;
        prevPoint = points[pointInd - 1];
        currentPoint = points[pointInd];
        partialLength = currentPoint.partialLength;
      }

      len = letters.length;
      xPos = 0;
      yPos = 0;
      var yOff = documentData.finalSize * 1.2 * 0.714;
      var firstLine = true;
      var animatorProps = void 0;
      var animatorSelector = void 0;
      var j = void 0;
      var jLen = void 0;
      var letterValue = void 0;

      jLen = animators.length;
      // let lastLetter;

      var mult = void 0;
      var ind = -1;
      var offf = void 0;
      var xPathPos = void 0;
      var yPathPos = void 0;
      var initPathPos = currentLength;
      var initSegmentInd = segmentInd;
      var initPointInd = pointInd;
      var currentLine = -1;
      var elemOpacity = void 0;
      var sc = void 0;
      var sw = void 0;
      var fc = void 0;
      var k = void 0;
      // let lineLength = 0;
      var letterSw = void 0;
      var letterSc = void 0;
      var letterFc = void 0;
      var letterM = '';
      var letterP = this.defaultPropsArray;
      var letterO = void 0;

      //
      if (documentData.j === 2 || documentData.j === 1) {
        var animatorJustifyOffset = 0;
        var animatorFirstCharOffset = 0;
        var justifyOffsetMult = documentData.j === 2 ? -0.5 : -1;
        var lastIndex = 0;
        var isNewLine = true;

        for (i = 0; i < len; i += 1) {
          if (letters[i].n) {
            if (animatorJustifyOffset) {
              animatorJustifyOffset += animatorFirstCharOffset;
            }
            while (lastIndex < i) {
              letters[lastIndex].animatorJustifyOffset = animatorJustifyOffset;
              lastIndex += 1;
            }
            animatorJustifyOffset = 0;
            isNewLine = true;
          } else {
            for (j = 0; j < jLen; j += 1) {
              animatorProps = animators[j].a;
              if (animatorProps.t.propType) {
                if (isNewLine && documentData.j === 2) {
                  animatorFirstCharOffset += animatorProps.t.v * justifyOffsetMult;
                }
                animatorSelector = animators[j].s;
                mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);
                if (mult.length) {
                  animatorJustifyOffset += animatorProps.t.v * mult[0] * justifyOffsetMult;
                } else {
                  animatorJustifyOffset += animatorProps.t.v * mult * justifyOffsetMult;
                }
              }
            }
            isNewLine = false;
          }
        }
        if (animatorJustifyOffset) {
          animatorJustifyOffset += animatorFirstCharOffset;
        }
        while (lastIndex < i) {
          letters[lastIndex].animatorJustifyOffset = animatorJustifyOffset;
          lastIndex += 1;
        }
      }
      //

      for (i = 0; i < len; i += 1) {
        matrixHelper.reset();
        elemOpacity = 1;
        if (letters[i].n) {
          xPos = 0;
          yPos += documentData.yOffset;
          yPos += firstLine ? 1 : 0;
          currentLength = initPathPos;
          firstLine = false;
          // lineLength = 0;
          if (this._hasMaskedPath) {
            segmentInd = initSegmentInd;
            pointInd = initPointInd;
            points = segments[segmentInd].bezierData.points;
            prevPoint = points[pointInd - 1];
            currentPoint = points[pointInd];
            partialLength = currentPoint.partialLength;
            segmentLength = 0;
          }
          letterO = letterSw = letterFc = letterM = '';
          letterP = this.defaultPropsArray;
        } else {
          if (this._hasMaskedPath) {
            if (currentLine !== letters[i].line) {
              switch (documentData.j) {
                case 1:
                  currentLength += totalLength - documentData.lineWidths[letters[i].line];
                  break;
                case 2:
                  currentLength += (totalLength - documentData.lineWidths[letters[i].line]) / 2;
                  break;
                default:
                  break;
              }
              currentLine = letters[i].line;
            }
            if (ind !== letters[i].ind) {
              if (letters[ind]) {
                currentLength += letters[ind].extra;
              }
              currentLength += letters[i].an / 2;
              ind = letters[i].ind;
            }
            currentLength += alignment[0] * letters[i].an / 200;
            var animatorOffset = 0;
            for (j = 0; j < jLen; j += 1) {
              animatorProps = animators[j].a;
              if (animatorProps.p.propType) {
                animatorSelector = animators[j].s;
                mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);
                if (mult.length) {
                  animatorOffset += animatorProps.p.v[0] * mult[0];
                } else {
                  animatorOffset += animatorProps.p.v[0] * mult;
                }
              }
              if (animatorProps.a.propType) {
                animatorSelector = animators[j].s;
                mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);
                if (mult.length) {
                  animatorOffset += animatorProps.a.v[0] * mult[0];
                } else {
                  animatorOffset += animatorProps.a.v[0] * mult;
                }
              }
            }
            flag = true;
            while (flag) {
              if (segmentLength + partialLength >= currentLength + animatorOffset || !points) {
                perc = (currentLength + animatorOffset - segmentLength) / currentPoint.partialLength;
                xPathPos = prevPoint.point[0] + (currentPoint.point[0] - prevPoint.point[0]) * perc;
                yPathPos = prevPoint.point[1] + (currentPoint.point[1] - prevPoint.point[1]) * perc;
                matrixHelper.translate(-alignment[0] * letters[i].an / 200, -(alignment[1] * yOff / 100));
                flag = false;
              } else if (points) {
                segmentLength += currentPoint.partialLength;
                pointInd += 1;
                if (pointInd >= points.length) {
                  pointInd = 0;
                  segmentInd += 1;
                  if (!segments[segmentInd]) {
                    if (mask.v.c) {
                      pointInd = 0;
                      segmentInd = 0;
                      points = segments[segmentInd].bezierData.points;
                    } else {
                      segmentLength -= currentPoint.partialLength;
                      points = null;
                    }
                  } else {
                    points = segments[segmentInd].bezierData.points;
                  }
                }
                if (points) {
                  prevPoint = currentPoint;
                  currentPoint = points[pointInd];
                  partialLength = currentPoint.partialLength;
                }
              }
            }
            offf = letters[i].an / 2 - letters[i].add;
            matrixHelper.translate(-offf, 0, 0);
          } else {
            offf = letters[i].an / 2 - letters[i].add;
            matrixHelper.translate(-offf, 0, 0);

            // Grouping alignment
            matrixHelper.translate(-alignment[0] * letters[i].an / 200, -alignment[1] * yOff / 100, 0);
          }

          // lineLength += letters[i].l / 2;
          for (j = 0; j < jLen; j += 1) {
            animatorProps = animators[j].a;
            if (animatorProps.t.propType) {
              animatorSelector = animators[j].s;
              mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);
              // This condition is to prevent applying tracking to first character in each line. Might be better to use a boolean "isNewLine"
              if (xPos !== 0 || documentData.j !== 0) {
                if (this._hasMaskedPath) {
                  if (mult.length) {
                    currentLength += animatorProps.t.v * mult[0];
                  } else {
                    currentLength += animatorProps.t.v * mult;
                  }
                } else if (mult.length) {
                  xPos += animatorProps.t.v * mult[0];
                } else {
                  xPos += animatorProps.t.v * mult;
                }
              }
            }
          }
          // lineLength += letters[i].l / 2;
          if (documentData.strokeWidthAnim) {
            sw = documentData.sw || 0;
          }
          if (documentData.strokeColorAnim) {
            if (documentData.sc) {
              sc = [documentData.sc[0], documentData.sc[1], documentData.sc[2]];
            } else {
              sc = [0, 0, 0];
            }
          }
          if (documentData.fillColorAnim && documentData.fc) {
            fc = [documentData.fc[0], documentData.fc[1], documentData.fc[2]];
          }
          for (j = 0; j < jLen; j += 1) {
            animatorProps = animators[j].a;
            if (animatorProps.a.propType) {
              animatorSelector = animators[j].s;
              mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);

              if (mult.length) {
                matrixHelper.translate(-animatorProps.a.v[0] * mult[0], -animatorProps.a.v[1] * mult[1], animatorProps.a.v[2] * mult[2]);
              } else {
                matrixHelper.translate(-animatorProps.a.v[0] * mult, -animatorProps.a.v[1] * mult, animatorProps.a.v[2] * mult);
              }
            }
          }
          for (j = 0; j < jLen; j += 1) {
            animatorProps = animators[j].a;
            if (animatorProps.s.propType) {
              animatorSelector = animators[j].s;
              mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);
              if (mult.length) {
                matrixHelper.scale(1 + (animatorProps.s.v[0] - 1) * mult[0], 1 + (animatorProps.s.v[1] - 1) * mult[1], 1);
              } else {
                matrixHelper.scale(1 + (animatorProps.s.v[0] - 1) * mult, 1 + (animatorProps.s.v[1] - 1) * mult, 1);
              }
            }
          }
          for (j = 0; j < jLen; j += 1) {
            animatorProps = animators[j].a;
            animatorSelector = animators[j].s;
            mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);
            if (animatorProps.sk.propType) {
              if (mult.length) {
                matrixHelper.skewFromAxis(-animatorProps.sk.v * mult[0], animatorProps.sa.v * mult[1]);
              } else {
                matrixHelper.skewFromAxis(-animatorProps.sk.v * mult, animatorProps.sa.v * mult);
              }
            }
            if (animatorProps.r.propType) {
              if (mult.length) {
                matrixHelper.rotateZ(-animatorProps.r.v * mult[2]);
              } else {
                matrixHelper.rotateZ(-animatorProps.r.v * mult);
              }
            }
            if (animatorProps.ry.propType) {
              if (mult.length) {
                matrixHelper.rotateY(animatorProps.ry.v * mult[1]);
              } else {
                matrixHelper.rotateY(animatorProps.ry.v * mult);
              }
            }
            if (animatorProps.rx.propType) {
              if (mult.length) {
                matrixHelper.rotateX(animatorProps.rx.v * mult[0]);
              } else {
                matrixHelper.rotateX(animatorProps.rx.v * mult);
              }
            }
            if (animatorProps.o.propType) {
              if (mult.length) {
                elemOpacity += (animatorProps.o.v * mult[0] - elemOpacity) * mult[0];
              } else {
                elemOpacity += (animatorProps.o.v * mult - elemOpacity) * mult;
              }
            }
            if (documentData.strokeWidthAnim && animatorProps.sw.propType) {
              if (mult.length) {
                sw += animatorProps.sw.v * mult[0];
              } else {
                sw += animatorProps.sw.v * mult;
              }
            }
            if (documentData.strokeColorAnim && animatorProps.sc.propType) {
              for (k = 0; k < 3; k += 1) {
                if (mult.length) {
                  sc[k] += (animatorProps.sc.v[k] - sc[k]) * mult[0];
                } else {
                  sc[k] += (animatorProps.sc.v[k] - sc[k]) * mult;
                }
              }
            }
            if (documentData.fillColorAnim && documentData.fc) {
              if (animatorProps.fc.propType) {
                for (k = 0; k < 3; k += 1) {
                  if (mult.length) {
                    fc[k] += (animatorProps.fc.v[k] - fc[k]) * mult[0];
                  } else {
                    fc[k] += (animatorProps.fc.v[k] - fc[k]) * mult;
                  }
                }
              }
              if (animatorProps.fh.propType) {
                if (mult.length) {
                  fc = (0, _common.addHueToRGB)(fc, animatorProps.fh.v * mult[0]);
                } else {
                  fc = (0, _common.addHueToRGB)(fc, animatorProps.fh.v * mult);
                }
              }
              if (animatorProps.fs.propType) {
                if (mult.length) {
                  fc = (0, _common.addSaturationToRGB)(fc, animatorProps.fs.v * mult[0]);
                } else {
                  fc = (0, _common.addSaturationToRGB)(fc, animatorProps.fs.v * mult);
                }
              }
              if (animatorProps.fb.propType) {
                if (mult.length) {
                  fc = (0, _common.addBrightnessToRGB)(fc, animatorProps.fb.v * mult[0]);
                } else {
                  fc = (0, _common.addBrightnessToRGB)(fc, animatorProps.fb.v * mult);
                }
              }
            }
          }

          for (j = 0; j < jLen; j += 1) {
            animatorProps = animators[j].a;

            if (animatorProps.p.propType) {
              animatorSelector = animators[j].s;
              mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);
              if (this._hasMaskedPath) {
                if (mult.length) {
                  matrixHelper.translate(0, animatorProps.p.v[1] * mult[0], -animatorProps.p.v[2] * mult[1]);
                } else {
                  matrixHelper.translate(0, animatorProps.p.v[1] * mult, -animatorProps.p.v[2] * mult);
                }
              } else if (mult.length) {
                matrixHelper.translate(animatorProps.p.v[0] * mult[0], animatorProps.p.v[1] * mult[1], -animatorProps.p.v[2] * mult[2]);
              } else {
                matrixHelper.translate(animatorProps.p.v[0] * mult, animatorProps.p.v[1] * mult, -animatorProps.p.v[2] * mult);
              }
            }
          }
          if (documentData.strokeWidthAnim) {
            letterSw = sw < 0 ? 0 : sw;
          }
          if (documentData.strokeColorAnim) {
            letterSc = 'rgb(' + Math.round(sc[0] * 255) + ',' + Math.round(sc[1] * 255) + ',' + Math.round(sc[2] * 255) + ')';
          }
          if (documentData.fillColorAnim && documentData.fc) {
            letterFc = 'rgb(' + Math.round(fc[0] * 255) + ',' + Math.round(fc[1] * 255) + ',' + Math.round(fc[2] * 255) + ')';
          }

          if (this._hasMaskedPath) {
            matrixHelper.translate(0, -documentData.ls);

            matrixHelper.translate(0, alignment[1] * yOff / 100 + yPos, 0);
            if (textData.p.p) {
              tanAngle = (currentPoint.point[1] - prevPoint.point[1]) / (currentPoint.point[0] - prevPoint.point[0]);
              var rot = Math.atan(tanAngle) * 180 / Math.PI;
              if (currentPoint.point[0] < prevPoint.point[0]) {
                rot += 180;
              }
              matrixHelper.rotate(-rot * Math.PI / 180);
            }
            matrixHelper.translate(xPathPos, yPathPos, 0);
            currentLength -= alignment[0] * letters[i].an / 200;
            if (letters[i + 1] && ind !== letters[i + 1].ind) {
              currentLength += letters[i].an / 2;
              currentLength += documentData.tr / 1000 * documentData.finalSize;
            }
          } else {
            matrixHelper.translate(xPos, yPos, 0);

            if (documentData.ps) {
              // matrixHelper.translate(documentData.ps[0],documentData.ps[1],0);
              matrixHelper.translate(documentData.ps[0], documentData.ps[1] + documentData.ascent, 0);
            }
            switch (documentData.j) {
              case 1:
                matrixHelper.translate(letters[i].animatorJustifyOffset + documentData.justifyOffset + (documentData.boxWidth - documentData.lineWidths[letters[i].line]), 0, 0);
                break;
              case 2:
                matrixHelper.translate(letters[i].animatorJustifyOffset + documentData.justifyOffset + (documentData.boxWidth - documentData.lineWidths[letters[i].line]) / 2, 0, 0);
                break;
              default:
                break;
            }
            matrixHelper.translate(0, -documentData.ls);
            matrixHelper.translate(offf, 0, 0);
            matrixHelper.translate(alignment[0] * letters[i].an / 200, alignment[1] * yOff / 100, 0);
            xPos += letters[i].l + documentData.tr / 1000 * documentData.finalSize;
          }
          if (renderType === 'html') {
            letterM = matrixHelper.toCSS();
          } else if (renderType === 'svg') {
            letterM = matrixHelper.to2dCSS();
          } else {
            letterP = [matrixHelper.props[0], matrixHelper.props[1], matrixHelper.props[2], matrixHelper.props[3], matrixHelper.props[4], matrixHelper.props[5], matrixHelper.props[6], matrixHelper.props[7], matrixHelper.props[8], matrixHelper.props[9], matrixHelper.props[10], matrixHelper.props[11], matrixHelper.props[12], matrixHelper.props[13], matrixHelper.props[14], matrixHelper.props[15]];
          }
          letterO = elemOpacity;
        }

        if (renderedLettersCount <= i) {
          letterValue = new _LetterProps2.default(letterO, letterSw, letterSc, letterFc, letterM, letterP);
          this.renderedLetters.push(letterValue);
          renderedLettersCount += 1;
          this.lettersChangedFlag = true;
        } else {
          letterValue = this.renderedLetters[i];
          this.lettersChangedFlag = letterValue.update(letterO, letterSw, letterSc, letterFc, letterM, letterP) || this.lettersChangedFlag;
        }
      }
    }
  }]);

  return TextAnimatorProperty;
}();

exports.default = TextAnimatorProperty;