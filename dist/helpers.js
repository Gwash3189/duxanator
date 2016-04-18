'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeById = exports.setAsId = exports.apply = undefined;

var _uniqueId = require('lodash/uniqueId');

var _uniqueId2 = _interopRequireDefault(_uniqueId);

var _middleware = require('./model/middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _stronganator = require('stronganator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apply = exports.apply = (0, _stronganator.func)([_stronganator.T.Union(_stronganator.T.Function, _stronganator.T.Hash), _stronganator.T.Spread(_stronganator.T.Any)]).of(function (f) {
  for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    values[_key - 1] = arguments[_key];
  }

  return (0, _stronganator.match)([_stronganator.T.Function, function (f) {
    return f.apply(undefined, values);
  }], [_stronganator.T.Default, function (x) {
    return x;
  }])(f);
});

var setAsId = exports.setAsId = (0, _stronganator.func)([_stronganator.T.Hash, _stronganator.T.Optional(_stronganator.T.Boolean)], _stronganator.T.Function).of(function (obj) {
  var isAsync = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
  return (0, _stronganator.func)([_stronganator.T.Function]).of(function (f) {
    var id = (0, _uniqueId2.default)('duxanator');
    obj[id] = (0, _middleware2.default)(f, isAsync);
    return id;
  });
});

var removeById = exports.removeById = function removeById(obj) {
  return function (id) {
    return delete obj[id];
  };
};