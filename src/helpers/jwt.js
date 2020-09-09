const jwt = require('jsonwebtoken')

module.exports = {
    issue(payload, expiresIn) {
        return jwt.sign(payload, process.env.secret, { expiresIn })
    }
}