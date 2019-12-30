'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _CompInterface = require('./CompInterface');

var _CompInterface2 = _interopRequireDefault(_CompInterface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  initExpressions: function initExpressions(animation) {
    animation.renderer.compInterface = (0, _CompInterface2.default)(animation.renderer);
    animation.renderer.globalData.projectInterface.registerComposition(animation.renderer);
  }
};