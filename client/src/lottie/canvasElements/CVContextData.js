'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transformationMatrix = require('../3rd_party/transformation-matrix');

var _transformationMatrix2 = _interopRequireDefault(_transformationMatrix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CVContextData = function () {
  function CVContextData() {
    _classCallCheck(this, CVContextData);

    this.saved = [];
    this.cArrPos = 0;
    this.cTr = new _transformationMatrix2.default();
    this.cO = 1;
    var i = void 0;
    var len = 15;
    this.savedOp = new Float32Array(len);
    for (i = 0; i < len; i += 1) {
      this.saved[i] = new Float32Array(16);
    }
    this._length = len;
  }

  _createClass(CVContextData, [{
    key: 'duplicate',
    value: function duplicate() {
      var newLength = this._length * 2;
      var currentSavedOp = this.savedOp;
      this.savedOp = new Float32Array(newLength);
      this.savedOp.set(currentSavedOp);
      var i = 0;
      for (i = this._length; i < newLength; i += 1) {
        this.saved[i] = new Float32Array(16);
      }
      this._length = newLength;
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.cArrPos = 0;
      this.cTr.reset();
      this.cO = 1;
    }
  }]);

  return CVContextData;
}();

exports.default = CVContextData;