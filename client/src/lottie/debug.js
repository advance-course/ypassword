'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableDebug = enableDebug;
exports.proxyCtx = proxyCtx;
var enableProxyLog = true;

function enableDebug(b) {
  enableProxyLog = !!b;
}

var methods = ['save', 'setFillStyle', 'moveTo', 'bezierCurveTo', 'closePath', 'fill', 'draw', 'beginPath', 'stroke', 'setTransform'];

function proxyCtx(ctx) {
  methods.forEach(function (method) {
    var oldMethod = ctx[method];
    if (typeof oldMethod === 'function') {
      Object.defineProperty(ctx, method, {
        value: function value() {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          if (enableProxyLog) {
            console.log.call(null, ['ctx.' + method + '('].concat(args.join(',')).concat(')').join(''));
          }
          return oldMethod.apply(ctx, args);
        }
      });
    }
  });

  if (typeof Proxy !== 'undefined') {
    /* eslint no-new: 0 */
    new Proxy(ctx, {
      set: function set(target, propKey, value) {
        console.log('ctx.' + propKey + ' = ' + value);
        ctx[propKey] = value;
      }
    });
  }
}

function debugElapsedTimeFactory() {
  var nameLog = {};
  return {
    start: function start(groupName) {
      nameLog[groupName] = +new Date();
    },
    end: function end(groupName) {
      var value = nameLog[groupName];
      if (typeof value === 'undefined') {
        throw new Error('debugElapsedTimeFactory start(' + groupName + ') is not invoke before end()');
      }
      console.log('debug:' + groupName, +new Date() - value + 'ms');
      delete nameLog[groupName];
    }
  };
}

// 打印耗时
var debug = exports.debug = debugElapsedTimeFactory();