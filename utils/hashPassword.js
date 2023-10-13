const bcrypt = require('bcrypt')

const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)

  try {
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
  } catch (err) {
    console.log(`Error: ${err.message}`)
  }
}

const comparePassword = async (password, hashedPassword) => {
  try {
    const isMatched = await bcrypt.compare(password, hashedPassword)
    return isMatched
  } catch (err) {
    console.log(`Error: ${err.message}`)
  }
}

module.exports = {
  encryptPassword,
  comparePassword
}