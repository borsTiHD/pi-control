const bcrypt = require('bcrypt')
const User = require('../models/user')

/**
 * Creating User and save data in db
 * @name createUser
 * @function
 * @memberof module:routers/auth
 */
exports.createUser = async(email, password) => {
    return await User.createUser({ email, password })
        .then((data) => {
            return data
        }).catch((error) => {
            throw error
        })
}

/**
 * xxx
 * @name xxx
 * @function
 * @memberof module:routers/auth
 */
exports.getUser = async(email) => {
    return await User.findOne({ email })
        .then((data) => {
            return data
        }).catch((error) => {
            throw error
        })
}

/**
 * Take a string and return a generated hash
 * @name generatePasswordHash
 * @function
 * @memberof module:routers/auth
 */
exports.generatePasswordHash = async(plainPassword) => {
    return await bcrypt.hash(plainPassword, 12)
}
