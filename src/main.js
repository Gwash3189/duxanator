import React, { Component, PropTypes } from 'react'
import cloneDeep from 'lodash/cloneDeep'
import uniqueId from 'lodash/uniqueId'
import each from 'lodash/each'
import identity from 'lodash/identity'

let store = {}
let listeners = {}
let middlewares = {}

export const getState = (f = identity) => f(store)

export const seedState = (obj) => {
  store = obj
}

export const listen = (listener) => {
  const id = uniqueId('state-')
  listeners[id] = listener

  return id
}

export const middleware = (middleware) => {
  const id = uniqueId('state-')
  middlewares[id] = middleware

  return id
}

export const action = (string, func) => {
  return (state, meta = {}) => {
    meta.actions = (meta.actions || []).concat(string)
    return func(state, meta)
  }
}

export const debug = () => {
  return (state, meta) => {
    const date = new Date()
    console.log('META', date , '\n', JSON.stringify(meta, null, 2))
    console.log('STATE', date, '\n', JSON.stringify(state, null, 2))
  }
}

export const clear = () => {
  store = {}
  listeners = {}
  middlewares = {}
}
export const silence = (id) => delete listeners[id]
export const underwear = (id) => delete middleware[id]

export const updateState = (f, meta = {}) => {
  let clone = cloneDeep(store)

  clone = f(clone, meta)
  each(middlewares, middleware => {
    clone = (middleware(clone, meta) || clone)
  })
  each(listeners, listener => listener(clone, meta))

  store = clone

  return store
}

export default class State extends Component {
  static propTypes = {
    container: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = props.state
    this.listenerId = listen(state => this.setState(state))
  }

  componentWillUnmount () {
    silence(this.listenId)
  }

  render () {
    const newProps = {
      state: { ...this.state, updateState }
    }
    return React.createElement(this.props.container, newProps)
  }
}

export const Connect = (state) => (container) => (
  <State state={state} container={container} />
)
