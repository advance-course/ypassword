'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function Mixin(baseClass) {
  for (var _len = arguments.length, mixins = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    mixins[_key - 1] = arguments[_key];
  }

  var copyProps = function copyProps(target, source) {
    // this function copies all properties and symbols, filtering out some special ones
    Object.getOwnPropertyNames(source)
    // .concat(Object.getOwnPropertySymbols(source))
    .forEach(function (prop) {
      try {
        if (!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)) {
          Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
        }
      } catch (err) {
        console.error(err);
      }
    });
  };

  var base = function (_baseClass) {
    _inherits(base, _baseClass);

    function base() {
      var _ref;

      _classCallCheck(this, base);

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var _this = _possibleConstructorReturn(this, (_ref = base.__proto__ || Object.getPrototypeOf(base)).call.apply(_ref, [this].concat(args)));

      mixins.forEach(function (mixin) {
        var mixinConstructor = new mixin();
        copyProps(_this, mixinConstructor);
      });
      return _this;
    }

    return base;
  }(baseClass);

  mixins.forEach(function (mixin) {
    // outside contructor() to allow aggregation(A,B,C).staticFunction() to be called etc.
    var proto = mixin.prototype.__proto__;
    while (proto && proto.constructor !== Object) {
      copyProps(base.prototype, proto);
      proto = proto.__proto__;
    }

    copyProps(base.prototype, mixin.prototype);
    copyProps(base, mixin);
  });

  return base;
}

function copyProperties(target, source) {
  if ((typeof source === 'undefined' ? 'undefined' : _typeof(source)) !== 'object') return;

  var _arr = [].concat(_toConsumableArray(Object.getOwnPropertyNames(source)));

  for (var _i = 0; _i < _arr.length; _i++) {
    var key = _arr[_i];
    if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
      var desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}

function extendClasses() {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  var constructors = [];

  var Class =
  /**
   * Creates an instance of Class.
   *
   * @memberOf Class
   */

  function Class() {
    _classCallCheck(this, Class);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = args[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var arg = _step.value;

        var props = Object.getOwnPropertyNames(arg.prototype);

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = props[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var prop = _step3.value;

            if (prop === 'constructor') {
              constructors.push(arg.prototype.constructor);
            } else {
              Class.prototype[prop] = arg.prototype[prop];
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    for (var _len4 = arguments.length, opts = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      opts[_key4] = arguments[_key4];
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = constructors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _constructor = _step2.value;

        Object.assign(Class.prototype, new (Function.prototype.bind.apply(_constructor, [null].concat(opts)))());
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  };

  return Class;
}

exports.default = Mixin;