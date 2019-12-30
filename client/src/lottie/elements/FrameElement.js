'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FrameElement = function () {
  function FrameElement() {
    _classCallCheck(this, FrameElement);
  }

  _createClass(FrameElement, [{
    key: 'initFrame',

    /**
       * @function
       * Initializes frame related properties.
       *
       */
    value: function initFrame() {
      // set to true when inpoint is rendered
      this._isFirstFrame = false;
      // list of animated properties
      this.dynamicProperties = [];
      // If layer has been modified in current tick this will be true
      this._mdf = false;
    }
    /**
     * @function
     * Calculates all dynamic values
     *
     * @param {number} num
     * current frame number in Layer's time
     * @param {boolean} isVisible
     * if layers is currently in range
     *
     */

  }, {
    key: 'prepareProperties',
    value: function prepareProperties(num, isVisible) {
      var i = void 0;
      var len = this.dynamicProperties.length;
      for (i = 0; i < len; i += 1) {
        if (isVisible || this._isParent && this.dynamicProperties[i].propType === 'transform') {
          this.dynamicProperties[i].getValue();
          if (this.dynamicProperties[i]._mdf) {
            this.globalData._mdf = true;
            this._mdf = true;
          }
        }
      }
    }
  }, {
    key: 'addDynamicProperty',
    value: function addDynamicProperty(prop) {
      if (this.dynamicProperties.indexOf(prop) === -1) {
        this.dynamicProperties.push(prop);
      }
    }
  }]);

  return FrameElement;
}();

exports.default = FrameElement;