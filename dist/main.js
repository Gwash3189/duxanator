'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Connect = exports.updateState = exports.underwear = exports.silence = exports.middleware = exports.listen = exports.seedState = exports.getState = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _uniqueId = require('lodash/uniqueId');

var _uniqueId2 = _interopRequireDefault(_uniqueId);

var _each = require('lodash/each');

var _each2 = _interopRequireDefault(_each);

var _identity = require('lodash/identity');

var _identity2 = _interopRequireDefault(_identity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var store = {};
var listeners = {};
var middlewares = {};

var getState = exports.getState = function getState() {
  var f = arguments.length <= 0 || arguments[0] === undefined ? _identity2.default : arguments[0];
  return f(store);
};

var seedState = exports.seedState = function seedState(obj) {
  store = obj;
};

var listen = exports.listen = function listen(listener) {
  var id = (0, _uniqueId2.default)('state-');
  listeners[id] = listener;

  return id;
};

var middleware = exports.middleware = function middleware(_middleware) {
  var id = (0, _uniqueId2.default)('state-');
  middlewares[id] = _middleware;

  return id;
};

var silence = exports.silence = function silence(id) {
  return delete listeners[id];
};
var underwear = exports.underwear = function underwear(id) {
  return delete middleware[id];
};

var updateState = exports.updateState = function updateState(f, meta) {
  var clone = (0, _cloneDeep2.default)(store);

  clone = f(clone);
  (0, _each2.default)(middlewares, function (middleware) {
    return middleware(clone, meta);
  });
  (0, _each2.default)(listeners, function (listener) {
    return listener(clone, meta);
  });

  store = clone;
};

var State = function (_Component) {
  _inherits(State, _Component);

  function State() {
    var _Object$getPrototypeO;

    _classCallCheck(this, State);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(State)).call.apply(_Object$getPrototypeO, [this].concat(args)));

    _this.state = getState();
    _this.listenerId = listen(function (state) {
      return _this.setState(state);
    });
    return _this;
  }

  _createClass(State, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      silence(this.listenId);
    }
  }, {
    key: 'render',
    value: function render() {
      var newProps = {
        state: _extends({}, store, { updateState: updateState })
      };
      return _react2.default.createElement(this.props.container, newProps);
    }
  }]);

  return State;
}(_react.Component);

State.propTypes = {
  container: _react.PropTypes.func.isRequired
};
exports.default = State;
var Connect = exports.Connect = function Connect(state) {
  return function (container) {
    return _react2.default.createElement(State, { state: state, container: container });
  };
};