"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseEvent = function () {
  function BaseEvent() {
    _classCallCheck(this, BaseEvent);
  }

  _createClass(BaseEvent, [{
    key: "triggerEvent",
    value: function triggerEvent(eventName, args) {
      if (this._cbs[eventName]) {
        var len = this._cbs[eventName].length;
        for (var i = 0; i < len; i++) {
          this._cbs[eventName][i](args);
        }
      }
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(eventName, callback) {
      if (!this._cbs[eventName]) {
        this._cbs[eventName] = [];
      }
      this._cbs[eventName].push(callback);

      return function () {
        this.removeEventListener(eventName, callback);
      }.bind(this);
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(eventName, callback) {
      if (!callback) {
        this._cbs[eventName] = null;
      } else if (this._cbs[eventName]) {
        var i = 0;
        var len = this._cbs[eventName].length;
        while (i < len) {
          if (this._cbs[eventName][i] === callback) {
            this._cbs[eventName].splice(i, 1);
            i -= 1;
            len -= 1;
          }
          i += 1;
        }
        if (!this._cbs[eventName].length) {
          this._cbs[eventName] = null;
        }
      }
    }
  }]);

  return BaseEvent;
}();

exports.default = BaseEvent;