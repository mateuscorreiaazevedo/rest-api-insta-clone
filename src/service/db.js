const mongoose = require('mongoose')
const env = require('../config/env')

const connect = async () => {
  try {
    const dbConnect = await mongoose.connect(
      `mongodb+srv://${env.dbUser}:${env.dbPass}@react-gram.1twxj9b.mongodb.net/?retryWrites=true&w=majority`
    )
    console.log('connect to database')
  } catch (error) {
    console.error(error.message)
  }
}

module.exports = connect