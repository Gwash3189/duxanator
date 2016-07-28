import extend from 'lodash/extend'

let middleware = function (executor, options = { async: false }) {
  extend(this, options)
  return (...values) => executor(...values)
}

middleware = middleware.bind(middleware)

export default middleware
