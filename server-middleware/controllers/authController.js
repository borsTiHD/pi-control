/**
 * Route logins a user
 * @name login
 * @function
 * @memberof module:routers/auth
 */
exports.login = async(req, res) => {
    console.log('LOGIN ROUTE')
}

/**
 * Route xxx
 * @name user
 * @function
 * @memberof module:routers/auth
 */
exports.user = async(req, res) => {
    res.json({
        _status: 'ok',
        info: 'xxx'
    })
}

/**
 * Route register a user
 * @name register
 * @function
 * @memberof module:routers/auth
 */
exports.register = async(req, res) => {
    res.json({
        _status: 'ok',
        info: 'xxx'
    })
}
