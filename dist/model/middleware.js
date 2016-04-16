'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extend = require('lodash/extend');

var _extend2 = _interopRequireDefault(_extend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var middleware = function middleware(executor) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? { async: false } : arguments[1];

  (0, _extend2.default)(this, options);
  return function () {
    return executor.apply(undefined, arguments);
  };
};

middleware = middleware.bind(middleware);

exports.default = middleware;