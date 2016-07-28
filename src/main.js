import React, { Component, PropTypes, cloneElement } from 'react'
import isEqual from 'lodash/isEqual'

import { apply, setAsId, removeById, iterate } from './helpers.js'


let state = {}
let listeners = {}
let middlewares = {}

export const getState = (x) => {
  return typeof x === 'function'
    ? x(state)
    : state
}

export const seedState = (f) => {
  state = apply(f, state)
}

export const listen = setAsId(listeners)
export const silence = removeById(listeners)

export const middleware = setAsId(middlewares)
export const underwear = removeById(middleware)

export const updateState = (f, meta = {}) => {
  let newState = apply(f, state, meta)

  newState = {
    ...state,
    ...newState
  }

  newState = iterate(middlewares)
    .reduce((newState, middleware) => {
      return {
        ...newState,
        ...apply(middleware, newState, meta) || {}
      }
    }, newState)

  state = newState

  iterate(listeners)
    .forEach((listener) => apply(listener, newState, meta))
}

export class State extends Component {

  constructor (props) {
    super(props)
    this.state = props.pluck(getState())
    this.listenId = listen((state) => this.setState(props.pluck(state)))
  }

  shouldComponentUpdate (_, nextState) {
    return !isEqual(this.state, this.props.pluck(nextState))
  }

  componentWillUnmount () {
    silence(this.listenId)
  }

  render () {
    return cloneElement(this.props.children, {
      ...this.state,
      ...this.props
    })
  }
}
