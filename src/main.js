import React, { Component, PropTypes, cloneElement } from 'react';
import { T, func, match } from 'stronganator';

import { apply, setAsId, removeById, iterate } from './helpers.js';

let state = {};
let listeners = {};
let middlewares = {};

export const getState = match(
  [T.Function, (f) => f(state)],
  [T.Default, () => state]
);

export const seedState = func(T.Union(T.Function, T.Hash))
  .of((f) => {
    state = apply(f, state);
  });

export const listen = setAsId(listeners);
export const silence = removeById(listeners);

export const middleware = setAsId(middlewares);
export const underwear = removeById(middleware);

export const updateState = func([T.Function, T.Optional(T.Hash)])
  .of((f, meta = {}) => {
    let newState = apply(f, state, meta);

    newState = {
      ...state,
      ...newState
    };

    newState = iterate(middlewares)
      .reduce((newState, middleware) => {
        return {
          ...newState,
          ...apply(middleware, newState, meta) || {}
        }
      }, newState);

    iterate(listeners)
      .forEach((listener) => apply(listener, newState, meta));

    state = newState
  });




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
