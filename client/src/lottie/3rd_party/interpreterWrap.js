'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _interpreter = require('./interpreter');

var _appendApis = Object.create(null); // const interpreter = require('./interpreter');
exports.default = {
  clearApi: function clearApi() {
    _appendApis = Object.create(null);
  },
  appendApis: function appendApis() {
    var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    Object.keys(v).forEach(function (key) {
      _appendApis[key] = v[key];
    });
  },
  run: function run(code) {
    var appendApi = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return (0, _interpreter.run)(code, Object.assign(_appendApis, appendApi));
  }
};