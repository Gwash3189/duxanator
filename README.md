# Duxanator
Small and simple universal state store, with react support.

## Why

I was tired of how verbose other state management libraries are. I don't want to specify an string describing my state update, i don't want large switch statements, i just want to update my state.

## How

```javascript
import { listen, middleware, silence, underwear, seedState, updateState } from 'duxanator';

seedState({
  user: {
    username: '',
  }
})

$('#username').on('change', (e) => {
  updateState((state) => {
    return {
      ...state.user,
      user: {
        username: e.target.value
      }
    }
  },
  {
    date: new Date()
  });
});

const middlewareId = middleware((state, meta) => {
  return {
    ...state.user,
    user: {
      username: state.user.username + ' - ' + meta.date
    }
  }
});

const listenerId = listen((state) => $('#displayUserName').text(state.user.username));

underwear(middlewareId);
silence(listenerId);
```

### seedState
`seedState(function(state: object):state | object): nil`

Seed state either takes an object which describes the initial state of your state store. Or, it takes a function which takes the state object, and should return the desired state.

### updateState
`updateState(function(state: object): object, metaData)`

takes a function which receives the current state, and returns the new desired state.

It also takes a optional second parameters, a meta data object. This object is provided to all middlewares.

The returned state is merged with the old state.

### listen
listen(function(state: object): nil): id

This function registers a listener. This provided function is then called every time `updateState` is called.

The function is provided one parameter, the new state.

An id is returned, this id can be used to unregister a listener.

### silence
`silence(id:string): boolean`

The id that should be provided to this function is the id that is returned from `listen`.

Returns a boolean, true if the silencing is successful or false for when it is not.

### middlewares
`middleware(function(state: object, metaData: object): state | nil): id`

Just like the listen function, as in it returns an id and registers a function to be called every time `updateState` is called.

However, middleware functions receive the meta data sent with state updates. Middleware can also return new state, which will be shallow merged with the old state.

If the middleware function returns nothing, then nothing is merged with the old state.

### underwear
`underwear(id)`

works just like silence, just with a funny name

## React integration
```js
const pluck = (state) => {
  return {
    user: state.user
  }
}

<State pluck={pluck}>
  <ChildComponent />
</State>
```
A react component named `State` is provided and integrates state changes into it's children.
The State component requires a `pluck` property. This property is a function.
This function receives the current state, and should return **only** the state the child component is interested in.

The child component will receive the object returned from the `pluck` function as props.

calling `updateState` will cause a re-render.

The re-render will only continue if the resulting state is different from the previous state. 
