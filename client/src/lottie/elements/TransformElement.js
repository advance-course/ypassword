'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transformationMatrix = require('../3rd_party/transformation-matrix');

var _transformationMatrix2 = _interopRequireDefault(_transformationMatrix);

var _TransformProperty = require('../utils/TransformProperty');

var _TransformProperty2 = _interopRequireDefault(_TransformProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TransformElement = function () {
  function TransformElement() {
    _classCallCheck(this, TransformElement);

    this.mHelper = new _transformationMatrix2.default();
  }

  _createClass(TransformElement, [{
    key: 'initTransform',
    value: function initTransform() {
      this.finalTransform = {
        mProp: this.data.ks ? _TransformProperty2.default.getTransformProperty(this, this.data.ks, this) : {
          o: 0
        },
        _matMdf: false,
        _opMdf: false,
        mat: new _transformationMatrix2.default()
      };
      if (this.data.ao) {
        this.finalTransform.mProp.autoOriented = true;
      }

      // TODO: check TYPE 11: Guided elements
      if (this.data.ty !== 11) {
        // this.createElements();
      }
    }
  }, {
    key: 'renderTransform',
    value: function renderTransform() {
      this.finalTransform._opMdf = this.finalTransform.mProp.o._mdf || this._isFirstFrame;
      this.finalTransform._matMdf = this.finalTransform.mProp._mdf || this._isFirstFrame;

      if (this.hierarchy) {
        var mat = void 0;
        var finalMat = this.finalTransform.mat;
        var i = 0;
        var len = this.hierarchy.length;
        // Checking if any of the transformation matrices in the hierarchy chain has changed.
        if (!this.finalTransform._matMdf) {
          while (i < len) {
            if (this.hierarchy[i].finalTransform.mProp._mdf) {
              this.finalTransform._matMdf = true;
              break;
            }
            i += 1;
          }
        }

        if (this.finalTransform._matMdf) {
          mat = this.finalTransform.mProp.v.props;
          finalMat.cloneFromProps(mat);
          for (i = 0; i < len; i += 1) {
            mat = this.hierarchy[i].finalTransform.mProp.v.props;
            finalMat.transform(mat[0], mat[1], mat[2], mat[3], mat[4], mat[5], mat[6], mat[7], mat[8], mat[9], mat[10], mat[11], mat[12], mat[13], mat[14], mat[15]);
          }
        }
      }
    }
  }, {
    key: 'globalToLocal',
    value: function globalToLocal(pt) {
      var transforms = [];
      transforms.push(this.finalTransform);
      var flag = true;
      var comp = this.comp;
      while (flag) {
        if (comp.finalTransform) {
          if (comp.data.hasMask) {
            transforms.splice(0, 0, comp.finalTransform);
          }
          comp = comp.comp;
        } else {
          flag = false;
        }
      }
      var i = void 0;
      var len = transforms.length;
      var ptNew = void 0;
      for (i = 0; i < len; i += 1) {
        ptNew = transforms[i].mat.applyToPointArray(0, 0, 0);
        // ptNew = transforms[i].mat.applyToPointArray(pt[0],pt[1],pt[2]);
        pt = [pt[0] - ptNew[0], pt[1] - ptNew[1], 0];
      }
      return pt;
    }
  }]);

  return TransformElement;
}();

exports.default = TransformElement;