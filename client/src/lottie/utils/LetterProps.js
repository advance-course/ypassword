"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LetterProps = function () {
  function LetterProps(o, sw, sc, fc, m, p) {
    _classCallCheck(this, LetterProps);

    this.o = o;
    this.sw = sw;
    this.sc = sc;
    this.fc = fc;
    this.m = m;
    this.p = p;
    this._mdf = {
      o: true,
      sw: !!sw,
      sc: !!sc,
      fc: !!fc,
      m: true,
      p: true
    };
  }

  _createClass(LetterProps, [{
    key: "update",
    value: function update(o, sw, sc, fc, m, p) {
      this._mdf.o = false;
      this._mdf.sw = false;
      this._mdf.sc = false;
      this._mdf.fc = false;
      this._mdf.m = false;
      this._mdf.p = false;
      var updated = false;

      if (this.o !== o) {
        this.o = o;
        this._mdf.o = true;
        updated = true;
      }
      if (this.sw !== sw) {
        this.sw = sw;
        this._mdf.sw = true;
        updated = true;
      }
      if (this.sc !== sc) {
        this.sc = sc;
        this._mdf.sc = true;
        updated = true;
      }
      if (this.fc !== fc) {
        this.fc = fc;
        this._mdf.fc = true;
        updated = true;
      }
      if (this.m !== m) {
        this.m = m;
        this._mdf.m = true;
        updated = true;
      }
      if (p.length && (this.p[0] !== p[0] || this.p[1] !== p[1] || this.p[4] !== p[4] || this.p[5] !== p[5] || this.p[12] !== p[12] || this.p[13] !== p[13])) {
        this.p = p;
        this._mdf.p = true;
        updated = true;
      }
      return updated;
    }
  }]);

  return LetterProps;
}();

exports.default = LetterProps;