'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeById = exports.setAsId = exports.apply = exports.iterate = undefined;

var _middleware = require('./model/middleware');

var _middleware2 = _interopRequireDefault(_middleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uniqueId = function () {
  var numb = 0;
  return function (seed) {
    return seed + '-' + numb;
  };
}();

var iterate = exports.iterate = function iterate(object) {
  return Object.keys(object).map(function (key) {
    return object[key];
  });
};

var apply = exports.apply = function apply(f) {
  for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    values[_key - 1] = arguments[_key];
  }

  return typeof f === 'function' ? f.apply(undefined, values) : f;
};

var setAsId = exports.setAsId = function setAsId(obj) {
  var isAsync = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
  return function (f) {
    var id = uniqueId('duxanator');
    obj[id] = (0, _middleware2.default)(f, isAsync);
    return id;
  };
};

var removeById = exports.removeById = function removeById(obj) {
  return function (id) {
    return delete obj[id];
  };
};