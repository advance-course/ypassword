"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DynamicPropertyContainer = function () {
  function DynamicPropertyContainer() {
    _classCallCheck(this, DynamicPropertyContainer);
  }

  _createClass(DynamicPropertyContainer, [{
    key: "addDynamicProperty",
    value: function addDynamicProperty(prop) {
      if (this.dynamicProperties.indexOf(prop) === -1) {
        this.dynamicProperties.push(prop);
        this.container.addDynamicProperty(this);
        this._isAnimated = true;
      }
    }
  }, {
    key: "iterateDynamicProperties",
    value: function iterateDynamicProperties() {
      this._mdf = false;
      var i = void 0;
      var len = this.dynamicProperties.length;
      for (i = 0; i < len; i += 1) {
        this.dynamicProperties[i].getValue();
        if (this.dynamicProperties[i]._mdf) {
          this._mdf = true;
        }
      }
    }
  }, {
    key: "initDynamicPropertyContainer",
    value: function initDynamicPropertyContainer(container) {
      this.container = container;
      this.dynamicProperties = [];
      this._mdf = false;
      this._isAnimated = false;
    }
  }]);

  return DynamicPropertyContainer;
}();

exports.default = DynamicPropertyContainer;