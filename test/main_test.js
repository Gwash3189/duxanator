import React from 'react';
import { expect } from 'chai';
import { spy, stub } from 'sinon';
import { getState, seedState, updateState, listen, middleware, silence, underwear, State } from './../src/main'

describe('duxanator', function () {
  afterEach(function () {
    seedState({});
  });

  describe('getState', function () {
    it('is a function', function () {
      expect(getState)
        .to.be.a('function')
    });

    describe('when no function is provided', function () {
      it('returns the current state', function () {
        expect(getState())
          .to.be.eql({});
      });
    });

    describe('when a function is provided', function () {
      let pluck = (state) => {
        state.working = true;
        return state;
      };

      it('returns result of the function', function () {
        expect(getState(pluck))
          .to.be.eql({ working: true })
      });
    });
  });

  describe('seedState', function () {
    it('is a function', function () {
      expect(seedState)
        .to.be.a('function')
    });

    it('clones the new state', function () {
      const state = { testing: true };

      seedState(seedState);

      expect(getState())
        .to.not.eql(state)
    });
  });

  describe('listen', function () {
    it('returns the id of the listener', function () {
      expect(listen(() => true))
        .to.be.ok
    });
  });

  describe('silence', function () {
    it('returns true if the listener is removed', function () {
      const id = listen(() => true);

      expect(silence(id))
        .to.be.ok
    });
  });

  describe('middleware', function () {
    it('returns the id of the listener', function () {
      expect(middleware(() => true))
        .to.be.ok
    });
  });

  describe('underwear', function () {
    it('returns true if the listener is removed', function () {
      const id = middleware(() => true);

      expect(underwear(id))
        .to.be.ok
    });
  });

  describe('updateState', function () {
    let listenerSpy, middlewareSpy;

    beforeEach(() => {
      listenerSpy = spy();
      middlewareSpy = spy();
    })

    it('calls the middleware functions with the newState and meta data', function () {
      const stateUpdate = { testing: 'yep' };
      const meta = { meta: 'so meta' };

      middleware(middlewareSpy, meta)

      updateState((state) => (stateUpdate), meta);

      expect(middlewareSpy.calledWith(stateUpdate, meta))
        .to.be.ok;
    });

    it('calls the listener functions with the newState and meta data', function () {
      const stateUpdate = { testing: 'yep' };
      const meta = { meta: 'so meta' };

      listen(listenerSpy)

      updateState((state) => stateUpdate, meta);

      expect(listenerSpy.calledWith(stateUpdate, meta))
        .to.be.ok;
    });

    it('clones the new state onto the old state', function () {
      const stateUpdate = { testing: 'yep' };

      updateState((state) => stateUpdate)

      expect(getState)
        .to.not.equal(stateUpdate)
    });
  });

  describe('State component', function () {
    const state = {user: {username: ''}};
    let component, pluckSpy;

    beforeEach(() => {
      pluckSpy = stub().returns(state.user);
      seedState(state);
      component = new State({ pluck: pluckSpy });
    });

    it('calls the pluck prop with the current state', function () {
      expect(pluckSpy.firstCall.args[0])
        .to.eql(state);
    });

    it('calls the pluck prop when state is updated', function () {
      updateState((state) => ({user: {username: 'asd'}}))
      expect(pluckSpy.secondCall.args[0])
        .to.eql({ user: { username: 'asd'}});
    });

    describe('shouldComponentUpdate', function () {
      it('returns true when nextState doesnt match the current state', function () {
        const result = component.shouldComponentUpdate(null, {user: {username: 'dsa'}})
        expect(result)
          .to.be.true
      });
    });
  });
});
