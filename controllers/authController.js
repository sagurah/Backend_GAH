const prisma = require('../prisma/index')
const { comparePassword, encryptPassword } = require('../utils/hashPassword')
const jwt = require('jsonwebtoken')

const jwtSecretKey = process.env.JWT_SECRET

const register = async (req, res) => {
  const newData = req.body

  const findUser = await prisma.akun.findFirst({
    where: {
      USERNAME: newData.username
    }
  })

  if(findUser) {
    return res.status(400).send({
      status: 'error',
      message: `Gagal register user, username ${findUser.USERNAME} sudah digunakan`
    })
  }

  try {
    const resultTableAkun = await prisma.akun.create({
      data: {
        USERNAME: newData.username,
        PASSWORD: await encryptPassword(newData.password),
        ID_ROLE: 4
      }
    })

    const resultTableCustomer = await prisma.customer.create({
      data: {
        akun: {
          connect: {
            ID_AKUN: resultTableAkun.ID_AKUN
          }
        }
      }
    })

    combinedResult = {
      akunData: resultTableAkun,
      customerData: resultTableCustomer
    }

    res.status(201).json({
      status: 'success',
      message: 'Berhasil register user',
      data: combinedData
    })
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: `Gagal register User
      Trace: ${err.message}`
    })
  }
}

const login = async (req, res) => {
  const loginData = req.body

  try {
    const findUser = await prisma.akun.findFirst({
      where: {
        USERNAME: loginData.username
      },
      include: {
        customer: true
      }
    })
  
    if(!findUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Username tidak ditemukan'
      })
    }
  
    const isPasswordMatch = await comparePassword(loginData.password, findUser.PASSWORD)
  
    if(!isPasswordMatch) {
      return res.status(400).json({
        status: 'error',
        message: 'Password tidak sesuai'
      })
    }
    
    const payload = findUser 

    const token = jwt.sign(payload, jwtSecretKey, { expiresIn: '1d' })

    res.status(200).json({
      status: 'success',
      message: 'Berhasil login user',
      data: {
        findUser,
        token: token
      }
    })
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: `Gagal login user
      Trace: ${err.message}`
    })
  }
}

module.exports = {
  register,
  login
}