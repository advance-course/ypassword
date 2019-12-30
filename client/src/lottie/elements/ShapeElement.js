'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ProcessedElement = require('../shapes/ProcessedElement');

var _ProcessedElement2 = _interopRequireDefault(_ProcessedElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IShapeElement = function () {
  function IShapeElement() {
    _classCallCheck(this, IShapeElement);
  }

  _createClass(IShapeElement, [{
    key: 'addShapeToModifiers',
    value: function addShapeToModifiers(data) {
      var i = void 0;
      var len = this.shapeModifiers.length;
      for (i = 0; i < len; i += 1) {
        this.shapeModifiers[i].addShape(data);
      }
    }
  }, {
    key: 'isShapeInAnimatedModifiers',
    value: function isShapeInAnimatedModifiers(data) {
      var i = 0;
      var len = this.shapeModifiers.length;
      while (i < len) {
        if (this.shapeModifiers[i].isAnimatedWithShape(data)) {
          return true;
        }
      }
      return false;
    }
  }, {
    key: 'renderModifiers',
    value: function renderModifiers() {
      if (!this.shapeModifiers.length) {
        return;
      }
      var i = void 0;
      var len = this.shapes.length;
      for (i = 0; i < len; i += 1) {
        this.shapes[i].sh.reset();
      }

      len = this.shapeModifiers.length;
      for (i = len - 1; i >= 0; i -= 1) {
        this.shapeModifiers[i].processShapes(this._isFirstFrame);
      }
    }
  }, {
    key: 'searchProcessedElement',
    value: function searchProcessedElement(elem) {
      var elements = this.processedElements;
      var i = 0;
      var len = elements.length;
      while (i < len) {
        if (elements[i].elem === elem) {
          return elements[i].pos;
        }
        i += 1;
      }
      return 0;
    }
  }, {
    key: 'addProcessedElement',
    value: function addProcessedElement(elem, pos) {
      var elements = this.processedElements;
      var i = elements.length;
      while (i) {
        i -= 1;
        if (elements[i].elem === elem) {
          elements[i].pos = pos;
          return;
        }
      }
      elements.push(new _ProcessedElement2.default(elem, pos));
    }
  }, {
    key: 'prepareFrame',
    value: function prepareFrame(num) {
      this.prepareRenderableFrame(num);
      this.prepareProperties(num, this.isInRange);
    }
  }, {
    key: 'lcEnum',
    get: function get() {
      return {
        1: 'butt',
        2: 'round',
        3: 'square'
      };
    }
  }, {
    key: 'ljEnum',
    get: function get() {
      return {
        1: 'miter',
        2: 'round',
        3: 'butt'
      };
    }
  }]);

  return IShapeElement;
}();

exports.default = IShapeElement;