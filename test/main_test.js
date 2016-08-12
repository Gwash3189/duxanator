import { expect } from 'chai';
import { spy } from 'sinon'
import { shallow } from 'enzyme'
import React from 'react'

import State, { listen, middleware, silence, underwear, updateState, seedState, getState, clear, Connect, action } from '../src/main'

describe('Duxanator', () => {
  afterEach(() => {
    clear()
  })

  context('listeners', () => {
    describe('listen', () => {
      it('returns a listener id', () => {
        expect(listen(() => true))
          .to.be.a('string')
      })
    })

    describe('silence', () => {
      it('removes the listener', () => {
        const id = listen(() => true)

        expect(silence(id))
          .to.be.true
      })
    })
  })

  context('middlewares', () => {
    describe('middleware', () => {
        it('returns a middleware id', () => {
          expect(middleware(() => true))
            .to.be.a('string')
        })
    })

    describe('underwear', () => {
      it('removes the middleware', () => {
        const id = middleware(() => true)

        expect(underwear(id))
          .to.be.true
      })
    })
  })

  context('state', () => {
    let state
    const initState = (store = {}) => {
      state = {
        users: [ { name: 'adam' } ],
        ...store
      }
      seedState(state)
    }

    beforeEach(() => {
      initState()
    })

    describe('getState', () => {
      context('when no function is provided', () => {
        it('returns the current state', () => {
          expect(getState())
            .to.eql(state)
        })
      })

      context('when a function is provided', () => {
        it('passes the current state to that function', () => {
          let stateSpy = spy()
          getState(stateSpy)

          expect(stateSpy)
            .to.have.been.calledWith(state)
        })

        it('returns what is returned from the provided function', () => {
          expect(getState(() => true))
            .to.equal(true)
        })
      })
    })

    describe('updateState', () => {
      let stateSpy,
          meta

      beforeEach(() => {
        stateSpy = spy()
        meta = { so: 'meta' }
      })

      it('passes the state and meta to the provided function', () => {
        updateState(stateSpy, meta)

        expect(stateSpy)
          .to.have.been.calledWith(state, meta)
      })

      it('replaces the state with whatever is returned', () => {
        updateState(() => 'yep')

        expect(getState())
          .to.equal('yep')
      })

      context('when there are middleware', () => {
        let middleSpy

        beforeEach(() => {
          middleSpy = spy(() => 'yep')

          middleware(middleSpy)
          updateState(x => x, meta)
        })

        it('passes the state and meta to the middleware', () => {
          expect(middleSpy)
            .to.have.been.calledWith(state, meta)
        })

        it('middleware can alter the state', () => {
          expect(getState())
            .to.equal('yep')
        })
      })

      context('when there are listeners', () => {
        let listenerSpy

        beforeEach(() => {
          listenerSpy = spy()

          middleware(listenerSpy)
          updateState(x => x, meta)
        })

        it('passes the state and meta to the middleware', () => {
          expect(listenerSpy)
            .to.have.been.calledWith(state, meta)
        })
      })
    })
  })

  context('State', () => {
    let component,
        state

    function Dummy (props) {
      return (
        <div>
          {props}
        </div>
      )
    }

    beforeEach(() => {
      state = {
        users: [ { name: 'adam' } ]
      }

      component = shallow(<State state={state} container={Dummy}/>)
    })

    it('renders the provided container', () => {
      expect(component.find(Dummy))
        .to.be.ok
    })

    it('passes down the provided state to the container', () => {
      const { state: { users } } = component.find(Dummy).props()

      expect(users)
        .to.eql(state.users)
    })

    it('provides a updateState function', () => {
      const { state: { updateState: updateStateFunction } } = component.find(Dummy).props()

      expect(updateStateFunction)
        .to.eql(updateState)
    })

    describe('Connect' ,() => {
      const state = {
        users: [ { name: 'adam' } ]
      }

      it('takes the state and returns a function', () => {
        expect(Connect(state))
          .to.be.a('function')
      })

      it('takes the container and returns a state component', () => {
        const component = shallow(Connect(state)(Dummy))
        expect(component.find(State))
          .to.be.ok
      })
    })
  })

  describe('action', () => {
    it('returns a function', () => {
      expect(action())
        .to.be.a('function')
    })

    it('adds the provided string to meta.actions ', () => {
      let checkMeta

      updateState(action('name', (_, meta) => {
        checkMeta = meta
      }))

      expect(checkMeta.actions)
        .to.have.eql(['name'])
    })
  })
})
