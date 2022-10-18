const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema(
  {
    userName: String,
    email: String,
    password: String,
    bio: String,
    userAvatar: String,
    link: String
  },
  {
    timestamps: true
  }
)

const User = mongoose.model('User', userSchema)

module.exports = User