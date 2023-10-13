const jwt = require('jsonwebtoken')
const prisma = require('../prisma/index')

const jwtSecretKey = process.env.JWT_SECRET

const Auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization

    if(!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      })
    }
    
    const verified = jwt.verify(token, jwtSecretKey)

    const findUser = await prisma.akun.findFirst({
      where: {
        USERNAME: verified.username
      }
    })

    if(!findUser) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      })
    }

    req.user = findUser
    next()
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: `Internal server error
      Trace: ${err.message}`
    })
  }
}

module.exports = Auth

