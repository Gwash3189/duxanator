import uniqueId from 'lodash/uniqueId';

export const isA = (thing, type) => typeof thing === type;

export const apply = (f, ...values) => isA(f, 'function') ? f(...values) : f;

export const setAsId = (obj) => (f) => {
  const id = uniqueId('duxanator');
  obj[id] = f;
  return id;
}

export const removeById = (obj) => (id) => delete obj[id];
