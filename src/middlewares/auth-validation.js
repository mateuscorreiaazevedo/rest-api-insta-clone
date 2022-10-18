const User = require('../models/User')
const jwt = require('jsonwebtoken')
const env = require('../config/env')

const authValidation = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ errors: ['Unauthorized access.']})
  try {
    const verified = jwt.verify(token, env.jwtSecret)

    req.user = await User.findById(verified.id).select('-password')
    next()
  } catch (error) {
    res.status(401).json({ errors: ['Invalid token.']})
  }
}

module.exports = authValidation