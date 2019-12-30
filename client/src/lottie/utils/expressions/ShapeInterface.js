'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (shapes, view, propertyGroup) {
  var interfaces = void 0;
  function _interfaceFunction(value) {
    if (typeof value === 'number') {
      return interfaces[value - 1];
    }
    var i = 0;
    var len = interfaces.length;
    while (i < len) {
      if (interfaces[i]._name === value) {
        return interfaces[i];
      }
      i += 1;
    }
  }
  _interfaceFunction.propertyGroup = propertyGroup;
  interfaces = iterateElements(shapes, view, _interfaceFunction);
  return _interfaceFunction;
};

var _ExpressionValue = require('../expressions/ExpressionValue');

var _ExpressionValue2 = _interopRequireDefault(_ExpressionValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function iterateElements(shapes, view, propertyGroup) {
  var arr = [];
  var i = void 0;
  var len = shapes ? shapes.length : 0;
  for (i = 0; i < len; i += 1) {
    if (shapes[i].ty === 'gr') {
      arr.push(groupInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'fl') {
      arr.push(fillInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'st') {
      arr.push(strokeInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'tm') {
      arr.push(trimInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'tr') {
      // arr.push(transformInterfaceFactory(shapes[i],view[i],propertyGroup));
    } else if (shapes[i].ty === 'el') {
      arr.push(ellipseInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'sr') {
      arr.push(starInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'sh') {
      arr.push(pathInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'rc') {
      arr.push(rectInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'rd') {
      arr.push(roundedInterfaceFactory(shapes[i], view[i], propertyGroup));
    } else if (shapes[i].ty === 'rp') {
      arr.push(repeaterInterfaceFactory(shapes[i], view[i], propertyGroup));
    }
  }
  return arr;
} /* eslint no-use-before-define: 0 */


function contentsInterfaceFactory(shape, view, propertyGroup) {
  var interfaces = void 0;
  var interfaceFunction = function interfaceFunction(value) {
    var i = 0;
    var len = interfaces.length;
    while (i < len) {
      if (interfaces[i]._name === value || interfaces[i].mn === value || interfaces[i].propertyIndex === value || interfaces[i].ix === value || interfaces[i].ind === value) {
        return interfaces[i];
      }
      i += 1;
    }
    if (typeof value === 'number') {
      return interfaces[value - 1];
    }
  };
  interfaceFunction.propertyGroup = function (val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(val - 1);
  };
  interfaces = iterateElements(shape.it, view.it, interfaceFunction.propertyGroup);
  interfaceFunction.numProperties = interfaces.length;
  interfaceFunction.propertyIndex = shape.cix;
  interfaceFunction._name = shape.nm;

  return interfaceFunction;
}

function groupInterfaceFactory(shape, view, propertyGroup) {
  var interfaceFunction = function _interfaceFunction(value) {
    switch (value) {
      case 'ADBE Vectors Group':
      case 'Contents':
      case 2:
        return interfaceFunction.content;
      // Not necessary for now. Keeping them here in case a new case appears
      // case 'ADBE Vector Transform Group':
      // case 3:
      default:
        return interfaceFunction.transform;
    }
  };
  interfaceFunction.propertyGroup = function (val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(val - 1);
  };
  var content = contentsInterfaceFactory(shape, view, interfaceFunction.propertyGroup);
  var transformInterface = transformInterfaceFactory(shape.it[shape.it.length - 1], view.it[view.it.length - 1], interfaceFunction.propertyGroup);
  interfaceFunction.content = content;
  interfaceFunction.transform = transformInterface;
  Object.defineProperty(interfaceFunction, '_name', {
    get: function get() {
      return shape.nm;
    }
  });
  // interfaceFunction.content = interfaceFunction;
  interfaceFunction.numProperties = shape.np;
  interfaceFunction.propertyIndex = shape.ix;
  interfaceFunction.nm = shape.nm;
  interfaceFunction.mn = shape.mn;
  return interfaceFunction;
}

function fillInterfaceFactory(shape, view, propertyGroup) {
  function interfaceFunction(val) {
    if (val === 'Color' || val === 'color') {
      return interfaceFunction.color;
    } else if (val === 'Opacity' || val === 'opacity') {
      return interfaceFunction.opacity;
    }
  }
  Object.defineProperties(interfaceFunction, {
    color: {
      get: function get() {
        return (0, _ExpressionValue2.default)(view.c, 1 / view.c.mult, 'color');
      }
    },
    opacity: {
      get: function get() {
        return (0, _ExpressionValue2.default)(view.o, 100);
      }
    },
    _name: {
      value: shape.nm
    },
    mn: {
      value: shape.mn
    }
  });

  view.c.setGroupProperty(propertyGroup);
  view.o.setGroupProperty(propertyGroup);
  return interfaceFunction;
}

function strokeInterfaceFactory(shape, view, propertyGroup) {
  function _propertyGroup(val) {
    if (val === 1) {
      // eslint:error
      // return ob;
      return {};
    }
    return propertyGroup(val - 1);
  }
  function _dashPropertyGroup(val) {
    if (val === 1) {
      return dashOb;
    }
    return _propertyGroup(val - 1);
  }
  function addPropertyToDashOb(i) {
    Object.defineProperty(dashOb, shape.d[i].nm, {
      get: function get() {
        return (0, _ExpressionValue2.default)(view.d.dataProps[i].p);
      }
    });
  }
  var i = void 0;
  var len = shape.d ? shape.d.length : 0;
  var dashOb = {};
  for (i = 0; i < len; i += 1) {
    addPropertyToDashOb(i);
    view.d.dataProps[i].p.setGroupProperty(_dashPropertyGroup);
  }

  function interfaceFunction(val) {
    if (val === 'Color' || val === 'color') {
      return interfaceFunction.color;
    } else if (val === 'Opacity' || val === 'opacity') {
      return interfaceFunction.opacity;
    } else if (val === 'Stroke Width' || val === 'stroke width') {
      return interfaceFunction.strokeWidth;
    }
  }
  Object.defineProperties(interfaceFunction, {
    color: {
      get: function get() {
        return (0, _ExpressionValue2.default)(view.c, 1 / view.c.mult, 'color');
      }
    },
    opacity: {
      get: function get() {
        return (0, _ExpressionValue2.default)(view.o, 100);
      }
    },
    strokeWidth: {
      get: function get() {
        return (0, _ExpressionValue2.default)(view.w);
      }
    },
    dash: {
      get: function get() {
        return dashOb;
      }
    },
    _name: {
      value: shape.nm
    },
    mn: {
      value: shape.mn
    }
  });

  view.c.setGroupProperty(_propertyGroup);
  view.o.setGroupProperty(_propertyGroup);
  view.w.setGroupProperty(_propertyGroup);
  return interfaceFunction;
}

function trimInterfaceFactory(shape, view, propertyGroup) {
  function _propertyGroup(val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(--val);
  }
  interfaceFunction.propertyIndex = shape.ix;

  view.s.setGroupProperty(_propertyGroup);
  view.e.setGroupProperty(_propertyGroup);
  view.o.setGroupProperty(_propertyGroup);

  function interfaceFunction(val) {
    if (val === shape.e.ix || val === 'End' || val === 'end') {
      return interfaceFunction.end;
    }
    if (val === shape.s.ix) {
      return interfaceFunction.start;
    }
    if (val === shape.o.ix) {
      return interfaceFunction.offset;
    }
  }
  interfaceFunction.propertyIndex = shape.ix;

  Object.defineProperties(interfaceFunction, {
    start: {
      get: function get() {
        return (0, _ExpressionValue2.default)(view.s, 1 / view.s.mult);
      }
    },
    end: {
      get: function get() {
        return (0, _ExpressionValue2.default)(view.e, 1 / view.e.mult);
      }
    },
    offset: {
      get: function get() {
        return (0, _ExpressionValue2.default)(view.o);
      }
    },
    _name: {
      value: shape.nm
    }
  });
  interfaceFunction.mn = shape.mn;
  return interfaceFunction;
}

function transformInterfaceFactory(shape, view, propertyGroup) {
  function _propertyGroup(val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(--val);
  }
  view.transform.mProps.o.setGroupProperty(_propertyGroup);
  view.transform.mProps.p.setGroupProperty(_propertyGroup);
  view.transform.mProps.a.setGroupProperty(_propertyGroup);
  view.transform.mProps.s.setGroupProperty(_propertyGroup);
  view.transform.mProps.r.setGroupProperty(_propertyGroup);
  if (view.transform.mProps.sk) {
    view.transform.mProps.sk.setGroupProperty(_propertyGroup);
    view.transform.mProps.sa.setGroupProperty(_propertyGroup);
  }
  view.transform.op.setGroupProperty(_propertyGroup);

  function interfaceFunction(value) {
    if (shape.a.ix === value || value === 'Anchor Point') {
      return interfaceFunction.anchorPoint;
    }
    if (shape.o.ix === value || value === 'Opacity') {
      return interfaceFunction.opacity;
    }
    if (shape.p.ix === value || value === 'Position') {
      return interfaceFunction.position;
    }
    if (shape.r.ix === value || value === 'Rotation' || value === 'ADBE Vector Rotation') {
      return interfaceFunction.rotation;
    }
    if (shape.s.ix === value || value === 'Scale') {
      return interfaceFunction.scale;
    }
    if (shape.sk && shape.sk.ix === value || value === 'Skew') {
      return interfaceFunction.skew;
    }
    if (shape.sa && shape.sa.ix === value || value === 'Skew Axis') {
      return interfaceFunction.skewAxis;
    }
  }
  Object.defineProperties(interfaceFunction, {
    opacity: {
      get: function get() {
        return (0, _ExpressionValue2.default)(view.transform.mProps.o, 1 / view.transform.mProps.o.mult);
      }
    },
    position: {
      get: function get() {
        return (0, _ExpressionValue2.default)(view.transform.mProps.p);
      }
    },
    anchorPoint: {
      get: function get() {
        return (0, _ExpressionValue2.default)(view.transform.mProps.a);
      }
    },
    scale: {
      get: function get() {
        return (0, _ExpressionValue2.default)(view.transform.mProps.s, 1 / view.transform.mProps.s.mult);
      }
    },
    rotation: {
      get: function get() {
        return (0, _ExpressionValue2.default)(view.transform.mProps.r, 1 / view.transform.mProps.r.mult);
      }
    },
    skew: {
      get: function get() {
        return (0, _ExpressionValue2.default)(view.transform.mProps.sk);
      }
    },
    skewAxis: {
      get: function get() {
        return (0, _ExpressionValue2.default)(view.transform.mProps.sa);
      }
    },
    _name: {
      value: shape.nm
    }
  });
  interfaceFunction.ty = 'tr';
  interfaceFunction.mn = shape.mn;
  return interfaceFunction;
}

function ellipseInterfaceFactory(shape, view, propertyGroup) {
  function _propertyGroup(val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(--val);
  }
  interfaceFunction.propertyIndex = shape.ix;
  var prop = view.sh.ty === 'tm' ? view.sh.prop : view.sh;
  prop.s.setGroupProperty(_propertyGroup);
  prop.p.setGroupProperty(_propertyGroup);
  function interfaceFunction(value) {
    if (shape.p.ix === value) {
      return interfaceFunction.position;
    }
    if (shape.s.ix === value) {
      return interfaceFunction.size;
    }
  }
  Object.defineProperties(interfaceFunction, {
    size: {
      get: function get() {
        return (0, _ExpressionValue2.default)(prop.s);
      }
    },
    position: {
      get: function get() {
        return (0, _ExpressionValue2.default)(prop.p);
      }
    },
    _name: {
      value: shape.nm
    }
  });
  interfaceFunction.mn = shape.mn;
  return interfaceFunction;
}

function starInterfaceFactory(shape, view, propertyGroup) {
  function _propertyGroup(val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(--val);
  }
  var prop = view.sh.ty === 'tm' ? view.sh.prop : view.sh;
  interfaceFunction.propertyIndex = shape.ix;
  prop.or.setGroupProperty(_propertyGroup);
  prop.os.setGroupProperty(_propertyGroup);
  prop.pt.setGroupProperty(_propertyGroup);
  prop.p.setGroupProperty(_propertyGroup);
  prop.r.setGroupProperty(_propertyGroup);
  if (shape.ir) {
    prop.ir.setGroupProperty(_propertyGroup);
    prop.is.setGroupProperty(_propertyGroup);
  }

  function interfaceFunction(value) {
    if (shape.p.ix === value) {
      return interfaceFunction.position;
    }
    if (shape.r.ix === value) {
      return interfaceFunction.rotation;
    }
    if (shape.pt.ix === value) {
      return interfaceFunction.points;
    }
    if (shape.or.ix === value || value === 'ADBE Vector Star Outer Radius') {
      return interfaceFunction.outerRadius;
    }
    if (shape.os.ix === value) {
      return interfaceFunction.outerRoundness;
    }
    if (shape.ir && (shape.ir.ix === value || value === 'ADBE Vector Star Inner Radius')) {
      return interfaceFunction.innerRadius;
    }
    if (shape.is && shape.is.ix === value) {
      return interfaceFunction.innerRoundness;
    }
  }
  Object.defineProperties(interfaceFunction, {
    position: {
      get: function get() {
        return (0, _ExpressionValue2.default)(prop.p);
      }
    },
    rotation: {
      get: function get() {
        return (0, _ExpressionValue2.default)(prop.r, 1 / prop.r.mult);
      }
    },
    points: {
      get: function get() {
        return (0, _ExpressionValue2.default)(prop.pt);
      }
    },
    outerRadius: {
      get: function get() {
        return (0, _ExpressionValue2.default)(prop.or);
      }
    },
    outerRoundness: {
      get: function get() {
        return (0, _ExpressionValue2.default)(prop.os);
      }
    },
    innerRadius: {
      get: function get() {
        if (!prop.ir) {
          return 0;
        }
        return (0, _ExpressionValue2.default)(prop.ir);
      }
    },
    innerRoundness: {
      get: function get() {
        if (!prop.is) {
          return 0;
        }
        return (0, _ExpressionValue2.default)(prop.is, 1 / prop.is.mult);
      }
    },
    _name: {
      value: shape.nm
    }
  });
  interfaceFunction.mn = shape.mn;
  return interfaceFunction;
}

function rectInterfaceFactory(shape, view, propertyGroup) {
  function _propertyGroup(val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(--val);
  }
  var prop = view.sh.ty === 'tm' ? view.sh.prop : view.sh;
  interfaceFunction.propertyIndex = shape.ix;
  prop.p.setGroupProperty(_propertyGroup);
  prop.s.setGroupProperty(_propertyGroup);
  prop.r.setGroupProperty(_propertyGroup);

  function interfaceFunction(value) {
    if (shape.p.ix === value) {
      return interfaceFunction.position;
    }
    if (shape.r.ix === value) {
      return interfaceFunction.roundness;
    }
    if (shape.s.ix === value || value === 'Size' || value === 'ADBE Vector Rect Size') {
      return interfaceFunction.size;
    }
  }
  Object.defineProperties(interfaceFunction, {
    position: {
      get: function get() {
        return (0, _ExpressionValue2.default)(prop.p);
      }
    },
    roundness: {
      get: function get() {
        return (0, _ExpressionValue2.default)(prop.r);
      }
    },
    size: {
      get: function get() {
        return (0, _ExpressionValue2.default)(prop.s);
      }
    },
    _name: {
      value: shape.nm
    }
  });
  interfaceFunction.mn = shape.mn;
  return interfaceFunction;
}

function roundedInterfaceFactory(shape, view, propertyGroup) {
  function _propertyGroup(val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(--val);
  }
  var prop = view;
  interfaceFunction.propertyIndex = shape.ix;
  prop.rd.setGroupProperty(_propertyGroup);

  function interfaceFunction(value) {
    if (shape.r.ix === value || value === 'Round Corners 1') {
      return interfaceFunction.radius;
    }
  }
  Object.defineProperties(interfaceFunction, {
    radius: {
      get: function get() {
        return (0, _ExpressionValue2.default)(prop.rd);
      }
    },
    _name: {
      value: shape.nm
    }
  });
  interfaceFunction.mn = shape.mn;
  return interfaceFunction;
}

function repeaterInterfaceFactory(shape, view, propertyGroup) {
  function _propertyGroup(val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(--val);
  }
  var prop = view;
  interfaceFunction.propertyIndex = shape.ix;
  prop.c.setGroupProperty(_propertyGroup);
  prop.o.setGroupProperty(_propertyGroup);

  function interfaceFunction(value) {
    if (shape.c.ix === value || value === 'Copies') {
      return interfaceFunction.copies;
    } else if (shape.o.ix === value || value === 'Offset') {
      return interfaceFunction.offset;
    }
  }
  Object.defineProperties(interfaceFunction, {
    copies: {
      get: function get() {
        return (0, _ExpressionValue2.default)(prop.c);
      }
    },
    offset: {
      get: function get() {
        return (0, _ExpressionValue2.default)(prop.o);
      }
    },
    _name: {
      value: shape.nm
    }
  });
  interfaceFunction.mn = shape.mn;
  return interfaceFunction;
}

function pathInterfaceFactory(shape, view, propertyGroup) {
  var prop = view.sh;
  function _propertyGroup(val) {
    if (val === 1) {
      return interfaceFunction;
    }
    return propertyGroup(--val);
  }
  prop.setGroupProperty(_propertyGroup);

  function interfaceFunction(val) {
    if (val === 'Shape' || val === 'shape' || val === 'Path' || val === 'path' || val === 'ADBE Vector Shape' || val === 2) {
      return interfaceFunction.path;
    }
  }
  Object.defineProperties(interfaceFunction, {
    path: {
      get: function get() {
        if (prop.k) {
          prop.getValue();
        }
        return prop;
      }
    },
    shape: {
      get: function get() {
        if (prop.k) {
          prop.getValue();
        }
        return prop;
      }
    },
    _name: {
      value: shape.nm
    },
    ix: {
      value: shape.ix
    },
    mn: {
      value: shape.mn
    }
  });
  return interfaceFunction;
}