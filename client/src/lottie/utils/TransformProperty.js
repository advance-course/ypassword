'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _transformationMatrix = require('../3rd_party/transformation-matrix');

var _transformationMatrix2 = _interopRequireDefault(_transformationMatrix);

var _PropertyFactory = require('./PropertyFactory');

var _PropertyFactory2 = _interopRequireDefault(_PropertyFactory);

var _dynamicProperties = require('./dynamicProperties');

var _dynamicProperties2 = _interopRequireDefault(_dynamicProperties);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var degToRads = Math.PI / 180;

var TransformProperty = function (_DynamicPropertyConta) {
  _inherits(TransformProperty, _DynamicPropertyConta);

  function TransformProperty(elem, data, container) {
    _classCallCheck(this, TransformProperty);

    var _this = _possibleConstructorReturn(this, (TransformProperty.__proto__ || Object.getPrototypeOf(TransformProperty)).call(this));

    _this.elem = elem;
    _this.frameId = -1;
    _this.propType = 'transform';
    _this.data = data;
    _this.v = new _transformationMatrix2.default();
    // Precalculated matrix with non animated properties
    _this.pre = new _transformationMatrix2.default();
    _this.appliedTransformations = 0;
    _this.initDynamicPropertyContainer(container || elem);
    if (data.p.s) {
      _this.px = _PropertyFactory2.default.getProp(elem, data.p.x, 0, 0, _this);
      _this.py = _PropertyFactory2.default.getProp(elem, data.p.y, 0, 0, _this);
      if (data.p.z) {
        _this.pz = _PropertyFactory2.default.getProp(elem, data.p.z, 0, 0, _this);
      }
    } else {
      _this.p = _PropertyFactory2.default.getProp(elem, data.p, 1, 0, _this);
    }
    if (data.r) {
      _this.r = _PropertyFactory2.default.getProp(elem, data.r, 0, degToRads, _this);
    } else if (data.rx) {
      _this.rx = _PropertyFactory2.default.getProp(elem, data.rx, 0, degToRads, _this);
      _this.ry = _PropertyFactory2.default.getProp(elem, data.ry, 0, degToRads, _this);
      _this.rz = _PropertyFactory2.default.getProp(elem, data.rz, 0, degToRads, _this);
      if (data.or.k[0].ti) {
        var i = void 0;
        var len = data.or.k.length;
        for (i = 0; i < len; i += 1) {
          data.or.k[i].to = data.or.k[i].ti = null;
        }
      }
      _this.or = _PropertyFactory2.default.getProp(elem, data.or, 1, degToRads, _this);
      // sh Indicates it needs to be capped between -180 and 180
      _this.or.sh = true;
    }
    if (data.sk) {
      _this.sk = _PropertyFactory2.default.getProp(elem, data.sk, 0, degToRads, _this);
      _this.sa = _PropertyFactory2.default.getProp(elem, data.sa, 0, degToRads, _this);
    }
    if (data.a) {
      _this.a = _PropertyFactory2.default.getProp(elem, data.a, 1, 0, _this);
    }
    if (data.s) {
      _this.s = _PropertyFactory2.default.getProp(elem, data.s, 1, 0.01, _this);
    }
    // Opacity is not part of the transform properties, that's why it won't use this.dynamicProperties. That way transforms won't get updated if opacity changes.
    if (data.o) {
      _this.o = _PropertyFactory2.default.getProp(elem, data.o, 0, 0.01, elem);
    } else {
      _this.o = {
        _mdf: false,
        v: 1
      };
    }
    _this._isDirty = true;
    if (!_this.dynamicProperties.length) {
      _this.getValue(true);
    }
    return _this;
  }

  _createClass(TransformProperty, [{
    key: 'applyToMatrix',
    value: function applyToMatrix(mat) {
      var _mdf = this._mdf;
      this.iterateDynamicProperties();
      this._mdf = this._mdf || _mdf;
      if (this.a) {
        mat.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]);
      }
      if (this.s) {
        mat.scale(this.s.v[0], this.s.v[1], this.s.v[2]);
      }
      if (this.sk) {
        mat.skewFromAxis(-this.sk.v, this.sa.v);
      }
      if (this.r) {
        mat.rotate(-this.r.v);
      } else {
        mat.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]);
      }
      if (this.data.p.s) {
        if (this.data.p.z) {
          mat.translate(this.px.v, this.py.v, -this.pz.v);
        } else {
          mat.translate(this.px.v, this.py.v, 0);
        }
      } else {
        mat.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
      }
    }
  }, {
    key: 'getValue',
    value: function getValue(forceRender) {
      if (this.elem.globalData.frameId === this.frameId) {
        return;
      }
      if (this._isDirty) {
        this.precalculateMatrix();
        this._isDirty = false;
      }

      this.iterateDynamicProperties();

      if (this._mdf || forceRender) {
        this.v.cloneFromProps(this.pre.props);
        if (this.appliedTransformations < 1) {
          this.v.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]);
        }
        if (this.appliedTransformations < 2) {
          this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]);
        }
        if (this.sk && this.appliedTransformations < 3) {
          this.v.skewFromAxis(-this.sk.v, this.sa.v);
        }
        if (this.r && this.appliedTransformations < 4) {
          this.v.rotate(-this.r.v);
        } else if (!this.r && this.appliedTransformations < 4) {
          this.v.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]);
        }
        if (this.autoOriented && this.p.keyframes && this.p.getValueAtTime) {
          var v1 = void 0;
          var v2 = void 0;
          if (this.p._caching.lastFrame + this.p.offsetTime <= this.p.keyframes[0].t) {
            v1 = this.p.getValueAtTime((this.p.keyframes[0].t + 0.01) / this.elem.globalData.frameRate, 0);
            v2 = this.p.getValueAtTime(this.p.keyframes[0].t / this.elem.globalData.frameRate, 0);
          } else if (this.p._caching.lastFrame + this.p.offsetTime >= this.p.keyframes[this.p.keyframes.length - 1].t) {
            v1 = this.p.getValueAtTime(this.p.keyframes[this.p.keyframes.length - 1].t / this.elem.globalData.frameRate, 0);
            v2 = this.p.getValueAtTime((this.p.keyframes[this.p.keyframes.length - 1].t - 0.01) / this.elem.globalData.frameRate, 0);
          } else {
            v1 = this.p.pv;
            v2 = this.p.getValueAtTime((this.p._caching.lastFrame + this.p.offsetTime - 0.01) / this.elem.globalData.frameRate, this.p.offsetTime);
          }
          this.v.rotate(-Math.atan2(v1[1] - v2[1], v1[0] - v2[0]));
        }
        if (this.data.p.s) {
          if (this.data.p.z) {
            this.v.translate(this.px.v, this.py.v, -this.pz.v);
          } else {
            this.v.translate(this.px.v, this.py.v, 0);
          }
        } else {
          this.v.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
        }
      }
      this.frameId = this.elem.globalData.frameId;
    }
  }, {
    key: 'precalculateMatrix',
    value: function precalculateMatrix() {
      if (!this.a.k) {
        this.pre.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]);
        this.appliedTransformations = 1;
      } else {
        return;
      }
      if (!this.s.effectsSequence.length) {
        this.pre.scale(this.s.v[0], this.s.v[1], this.s.v[2]);
        this.appliedTransformations = 2;
      } else {
        return;
      }
      if (this.sk) {
        if (!this.sk.effectsSequence.length && !this.sa.effectsSequence.length) {
          this.pre.skewFromAxis(-this.sk.v, this.sa.v);
          this.appliedTransformations = 3;
        } else {
          return;
        }
      }
      if (this.r) {
        if (!this.r.effectsSequence.length) {
          this.pre.rotate(-this.r.v);
          this.appliedTransformations = 4;
        }
      } else if (!this.rz.effectsSequence.length && !this.ry.effectsSequence.length && !this.rx.effectsSequence.length && !this.or.effectsSequence.length) {
        this.pre.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]);
        this.appliedTransformations = 4;
      }
    }
  }, {
    key: 'autoOrient',
    value: function autoOrient() {}
  }, {
    key: 'addDynamicProperty',
    value: function addDynamicProperty(prop) {
      _get(TransformProperty.prototype.__proto__ || Object.getPrototypeOf(TransformProperty.prototype), 'addDynamicProperty', this).call(this, prop);
      this.elem.addDynamicProperty(prop);
      this._isDirty = true;
    }
  }]);

  return TransformProperty;
}(_dynamicProperties2.default);

exports.default = {
  getTransformProperty: function getTransformProperty(elem, data, container) {
    return new TransformProperty(elem, data, container);
  }
};