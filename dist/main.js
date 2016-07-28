'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.State = exports.updateState = exports.underwear = exports.middleware = exports.silence = exports.listen = exports.seedState = exports.getState = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _helpers = require('./helpers.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var state = {};
var listeners = {};
var middlewares = {};

var getState = exports.getState = function getState(x) {
  return typeof x === 'function' ? x(state) : state;
};

var seedState = exports.seedState = function seedState(f) {
  state = (0, _helpers.apply)(f, state);
};

var listen = exports.listen = (0, _helpers.setAsId)(listeners);
var silence = exports.silence = (0, _helpers.removeById)(listeners);

var middleware = exports.middleware = (0, _helpers.setAsId)(middlewares);
var underwear = exports.underwear = (0, _helpers.removeById)(middleware);

var updateState = exports.updateState = function updateState(f) {
  var meta = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var newState = (0, _helpers.apply)(f, state, meta);

  newState = _extends({}, state, newState);

  newState = (0, _helpers.iterate)(middlewares).reduce(function (newState, middleware) {
    return _extends({}, newState, (0, _helpers.apply)(middleware, newState, meta) || {});
  }, newState);

  state = newState;

  (0, _helpers.iterate)(listeners).forEach(function (listener) {
    return (0, _helpers.apply)(listener, newState, meta);
  });
};

var State = exports.State = function (_Component) {
  _inherits(State, _Component);

  function State(props) {
    _classCallCheck(this, State);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(State).call(this, props));

    _this.state = props.pluck(getState());
    _this.listenId = listen(function (state) {
      return _this.setState(props.pluck(state));
    });
    return _this;
  }

  _createClass(State, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(_, nextState) {
      return !(0, _isEqual2.default)(this.state, this.props.pluck(nextState));
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      silence(this.listenId);
    }
  }, {
    key: 'render',
    value: function render() {
      return (0, _react.cloneElement)(this.props.children, _extends({}, this.state, this.props));
    }
  }]);

  return State;
}(_react.Component);