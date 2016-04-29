import Middleware from './model/middleware';
import { func, T, match } from 'stronganator';

const uniqueId = (() => {
  let numb = 0;
  return func(T.String).of((seed) => {
    return `${seed}-${numb}`;
  });
})();

export const iterate = func([T.Hash], T.Array(T.Any))
.of((object) => {
  return Object.keys(object)
    .map(key => object[key])
})

export const apply = func([T.Union(T.Function, T.Hash), T.Spread(T.Any)])
.of((f, ...values) =>  {
  return match(
    [T.Function, (f) => f(...values)],
    [T.Default, (x) => x]
  )(f);
})

export const setAsId = func([T.Hash, T.Optional(T.Boolean)], T.Function)
.of((obj, isAsync = false) => func([T.Function])
  .of((f) => {
    const id = uniqueId('duxanator');
    obj[id] = Middleware(f, isAsync);
    return id;
  })
);

export const removeById = (obj) => (id) => delete obj[id];
