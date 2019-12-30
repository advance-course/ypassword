'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ExpressionValue = require('./ExpressionValue');

var _ExpressionValue2 = _interopRequireDefault(_ExpressionValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createEffectsInterface(elem, propertyGroup) {
  if (elem.effectsManager) {
    var effectElements = [];
    var effectsData = elem.data.ef;
    var i = void 0;
    var len = elem.effectsManager.effectElements.length;
    for (i = 0; i < len; i += 1) {
      effectElements.push(createGroupInterface(effectsData[i], elem.effectsManager.effectElements[i], propertyGroup, elem));
    }

    return function (name) {
      var effects = elem.data.ef || [];
      // let i = 0;
      // let len = effects.length;
      while (i < len) {
        if (name === effects[i].nm || name === effects[i].mn || name === effects[i].ix) {
          return effectElements[i];
        }
        i += 1;
      }
    };
  }
}

function createGroupInterface(data, elements, propertyGroup, elem) {
  var effectElements = [];
  var i = void 0;
  var len = data.ef.length;
  for (i = 0; i < len; i += 1) {
    if (data.ef[i].ty === 5) {
      effectElements.push(createGroupInterface(data.ef[i], elements.effectElements[i], elements.effectElements[i].propertyGroup, elem));
    } else {
      effectElements.push(createValueInterface(elements.effectElements[i], data.ef[i].ty, elem, _propertyGroup));
    }
  }

  var groupInterface = function groupInterface(name) {
    var effects = data.ef;
    // let i = 0;
    // let len = effects.length;
    while (i < len) {
      if (name === effects[i].nm || name === effects[i].mn || name === effects[i].ix) {
        if (effects[i].ty === 5) {
          return effectElements[i];
        }
        return effectElements[i]();
      }
      i += 1;
    }
    return effectElements[0]();
  };

  function _propertyGroup(val) {
    if (val === 1) {
      return groupInterface;
    }
    return propertyGroup(val - 1);
  }

  groupInterface.propertyGroup = _propertyGroup;

  if (data.mn === 'ADBE Color Control') {
    Object.defineProperty(groupInterface, 'color', {
      get: function get() {
        return effectElements[0]();
      }
    });
  }
  Object.defineProperty(groupInterface, 'numProperties', {
    get: function get() {
      return data.np;
    }
  });
  groupInterface.active = data.en !== 0;
  return groupInterface;
}

function createValueInterface(element, type, elem, propertyGroup) {
  function interfaceFunction() {
    if (type === 10) {
      return elem.comp.compInterface(element.p.v);
    }
    return (0, _ExpressionValue2.default)(element.p);
  }

  if (element.p.setGroupProperty) {
    element.p.setGroupProperty(propertyGroup);
  }

  return interfaceFunction;
}

var ob = {
  createEffectsInterface: createEffectsInterface
};

exports.default = ob;