// Async/await middleware
// Wrapper for using promises in express routes
const asyncUtil = (fn) =>
    function asyncUtilWrap(req, res, next, ...args) {
        const fnReturn = fn(req, res, next, ...args)
        return Promise.resolve(fnReturn).catch(next)
    }

export default asyncUtil
