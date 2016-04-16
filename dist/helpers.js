'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeById = exports.setAsId = exports.apply = exports.isA = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _uniqueId = require('lodash/uniqueId');

var _uniqueId2 = _interopRequireDefault(_uniqueId);

var _middleware = require('./model/middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _stronganator = require('stronganator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isA = exports.isA = function isA(thing, type) {
  return typeof type === 'function' ? thing.constructor === type : (typeof thing === 'undefined' ? 'undefined' : _typeof(thing)) === type;
};

var apply = exports.apply = function apply(f) {
  for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    values[_key - 1] = arguments[_key];
  }

  return isA(f, 'function') ? f.apply(undefined, values) : f;
};

var setAsId = exports.setAsId = function setAsId(obj) {
  var isAsync = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
  return function (f) {
    var id = (0, _uniqueId2.default)('duxanator');
    obj[id] = (0, _middleware2.default)(f, isAsync);
    return id;
  };
};

var removeById = exports.removeById = function removeById(obj) {
  return function (id) {
    return delete obj[id];
  };
};