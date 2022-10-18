require('dotenv').config()

module.exports = {
  port: process.env.PORT,
  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASS,
  jwtSecret: process.env.JWT_SECRET
}