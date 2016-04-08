'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.State = exports.updateState = exports.underwear = exports.silence = exports.listen = exports.middleware = exports.seedState = exports.getState = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _reduce = require('lodash/reduce');

var _reduce2 = _interopRequireDefault(_reduce);

var _uniqueId = require('lodash/uniqueId');

var _uniqueId2 = _interopRequireDefault(_uniqueId);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var state = {};
var listeners = {};
var middlewares = {};

var isA = function isA(thing, type) {
  return (typeof thing === 'undefined' ? 'undefined' : _typeof(thing)) === type;
};
var apply = function apply(f) {
  for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    values[_key - 1] = arguments[_key];
  }

  return isA(f, 'function') ? f.apply(undefined, values) : f;
};
var setAsId = function setAsId(obj) {
  return function (f) {
    var id = (0, _uniqueId2.default)('duxanator');
    obj[id] = f;
    return id;
  };
};
var removeById = function removeById(obj) {
  return function (id) {
    return delete obj[id];
  };
};

var getState = exports.getState = function getState(f) {
  return isA(f, 'function') ? f(state) : state;
};

var seedState = exports.seedState = function seedState(f) {
  state = (0, _cloneDeep2.default)(apply(f, state));
};

var middleware = exports.middleware = setAsId(middlewares);
var listen = exports.listen = setAsId(listeners);
var silence = exports.silence = removeById(listeners);
var underwear = exports.underwear = removeById(middleware);

var updateState = exports.updateState = function updateState(f) {
  var meta = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var newState = apply(f, state, meta);

  newState = _extends({}, state, newState);

  newState = (0, _reduce2.default)(middlewares, function (newState, middleware) {
    return _extends({}, newState, apply(middleware, newState, meta) || {});
  }, newState);

  (0, _forEach2.default)(listeners, function (listener) {
    return apply(listener, newState, meta);
  });

  state = (0, _cloneDeep2.default)(newState);
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
      return this.state !== nextState;
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

State.propTypes = {
  children: _react.PropTypes.node.isRequired,
  pluck: _react.PropTypes.func.isRequired
};