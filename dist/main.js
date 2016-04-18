'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.State = exports.updateState = exports.underwear = exports.middleware = exports.silence = exports.listen = exports.seedState = exports.getState = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _reduce = require('lodash/reduce');

var _reduce2 = _interopRequireDefault(_reduce);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _stronganator = require('stronganator');

var _helpers = require('./helpers.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var state = {};
var listeners = {};
var middlewares = {};

var getState = exports.getState = (0, _stronganator.match)([_stronganator.T.Function, function (f) {
  return f(state);
}], [_stronganator.T.Default, function () {
  return state;
}]);

var seedState = exports.seedState = (0, _stronganator.func)(_stronganator.T.Union(_stronganator.T.Function, _stronganator.T.Hash)).of(function (f) {
  state = (0, _cloneDeep2.default)((0, _helpers.apply)(f, state));
});

var listen = exports.listen = (0, _helpers.setAsId)(listeners);
var silence = exports.silence = (0, _helpers.removeById)(listeners);

var middleware = exports.middleware = (0, _helpers.setAsId)(middlewares);
var underwear = exports.underwear = (0, _helpers.removeById)(middleware);

var updateState = exports.updateState = (0, _stronganator.func)([_stronganator.T.Function, _stronganator.T.Optional(_stronganator.T.Hash)]).of(function (f) {
  var meta = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var newState = (0, _helpers.apply)(f, state, meta);

  newState = _extends({}, state, newState);

  newState = (0, _reduce2.default)(middlewares, function (newState, middleware) {
    return _extends({}, newState, (0, _helpers.apply)(middleware, newState, meta) || {});
  }, newState);

  (0, _forEach2.default)(listeners, function (listener) {
    return (0, _helpers.apply)(listener, newState, meta);
  });

  state = (0, _cloneDeep2.default)(newState);
});

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