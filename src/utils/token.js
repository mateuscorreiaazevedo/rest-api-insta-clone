const env = require('../config/env')
const jwt = require('jsonwebtoken')

const generateToken = (id) => jwt.sign({ id }, env.jwtSecret, { expiresIn: '7d' })

module.exports = generateToken