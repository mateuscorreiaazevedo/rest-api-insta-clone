const bcrypt = require('bcryptjs')

const passwordHash = async (password) => {
  const salt = await bcrypt.genSalt()
  const newPassword = await bcrypt.hash(password, salt)

  return newPassword
}

module.exports = { passwordHash }