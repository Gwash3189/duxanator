# Duxanator
Small and simple universal state store, with react support.

## Why

I was tired of how verbose other state management libraries are. I don't want large
switch statements. I don't want to update three files just to get a property into
my state tree.

State management is hard enough without external libraries getting in the way.

## How

```javascript
import { listen, middleware, silence, underwear, seedState, updateState, debug, action} from 'duxanator';

seedState({
  user: {
    username: '',
  }
})

const updateUserName = (e) => action('update user name', (state) => {
  state.user.username = e.target.value
  return state
})

$('#username').on('change', (e) => {
  updateState(updateUserName(e), { date: new Date() });
});

const middlewareId = middleware((state, meta) => {
  meta.foo = 'bar'
  state.user.bar = 'foo'

  return state
});

const listenerId = listen((state) => $('#displayUserName').text(state.user.username));

underwear(middlewareId);
silence(listenerId);
```

## React integration

### Connect

A higher order component is provided as to provide a way to connect you state, to your react component.

```js
import React, { Component } from 'react'
import { Connect, getState } from 'duxanator'


class Thing extends Component {
  render() {
    return (
      <div> { this.props.state }</div>
    )
  }
}

export default Connect(getState())(Thing)
```
