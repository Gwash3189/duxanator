import cloneDeep from 'lodash/cloneDeep';
import forEach from 'lodash/forEach';
import reduce from 'lodash/reduce';
import uniqueId from 'lodash/uniqueId';
import React, { Component, PropTypes, cloneElement } from 'react';

let state = {};
let listeners = {};
let middlewares = {};

const isA = (thing, type) => typeof thing === type;
const apply = (f, ...values) => isA(f, 'function') ? f(...values) : f;
const setAsId = (obj) => (f) => {
  const id = uniqueId('duxanator');
  obj[id] = f;
  return id;
}
const removeById = (obj) => (id) => delete obj[id];

export const getState = (f) => isA(f, 'function') ? f(state) : state;

export const seedState = (f) => {
  state = cloneDeep(apply(f, state));
};

export const middleware = setAsId(middlewares);
export const listen = setAsId(listeners);
export const silence = removeById(listeners);
export const underwear = removeById(middleware);

export const updateState = (f, meta = {}) => {
  let newState = apply(f, state, meta);

  newState = {
    ...state,
    ...newState
  };

  newState = reduce(middlewares, (newState, middleware) => {
    return {
      ...newState,
      ...apply(middleware, newState, meta)
    }
  }, newState);

  forEach(listeners, (listener) => apply(listener, newState, meta));

  state = cloneDeep(newState);
};

export class State extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    pluck: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = props.pluck(getState());
    this.listenId = listen((state) => this.setState(props.pluck(state)))
  }

  shouldComponentUpdate(_, nextState) {
    return this.state !== nextState;
  }

  componentWillUnmount() {
    silence(this.listenId);
  }

  render() {
    return cloneElement(this.props.children, {
      ...this.state,
      ...this.props
    });
  }
}
