"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HierarchyElement = function () {
  function HierarchyElement() {
    _classCallCheck(this, HierarchyElement);
  }

  _createClass(HierarchyElement, [{
    key: "initHierarchy",

    /**
       * @function
       * Initializes hierarchy properties
       *
       */
    value: function initHierarchy() {
      // element's parent list
      this.hierarchy = [];
      // if element is parent of another layer _isParent will be true
      this._isParent = false;
      this.checkParenting();
    }
    /**
       * @function
       * Sets layer's hierarchy.
       * @param {array} hierarch
       * layer's parent list
       *
       */

  }, {
    key: "setHierarchy",
    value: function setHierarchy(hierarchy) {
      this.hierarchy = hierarchy;
    }
    /**
       * @function
       * Sets layer as parent.
       *
       */

  }, {
    key: "setAsParent",
    value: function setAsParent() {
      this._isParent = true;
    }
    /**
       * @function
       * Searches layer's parenting chain
       *
       */

  }, {
    key: "checkParenting",
    value: function checkParenting() {
      if (this.data.parent !== undefined) {
        this.comp.buildElementParenting(this, this.data.parent, []);
      }
    }
  }]);

  return HierarchyElement;
}();

exports.default = HierarchyElement;