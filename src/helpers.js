import Middleware from './model/middleware'

const uniqueId = (() => {
  let numb = 0
  return (seed) => {
    return `${seed}-${numb}`
  }
})()

export const iterate = (object) => {
  return Object.keys(object)
    .map(key => object[key])
}

export const apply = (f, ...values) => {
  return typeof f === 'function'
    ? f(...values)
    : f
}

export const setAsId = (obj, isAsync = false) => (f) => {
  const id = uniqueId('duxanator')
  obj[id] = Middleware(f, isAsync)
  return id
}

export const removeById = (obj) => (id) => delete obj[id]
