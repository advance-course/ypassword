'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _debug = require('./debug');

Object.keys(_debug).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _debug[key];
    }
  });
});

var _AnimationManager = require('./animation/AnimationManager');

var _AnimationManager2 = _interopRequireDefault(_AnimationManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _AnimationManager2.default;