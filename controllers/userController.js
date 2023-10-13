const prisma = require('../prisma/index')
const { encryptPassword } = require('../utils/hashPassword')

const getProfile = async (req, res) => {
  const username = req.params.username

  const findUser = await prisma.akun.findFirst({
    where: {
      USERNAME: username
    }
  })

  if(!findUser) {
    return res.status(404).json({
      status: 'error',
      message: `User dengan username ${username} tidak ditemukan`
    })
  }

  const userCredentials = await prisma.customer.findFirst({
    where: {
      ID_AKUN: findUser.ID_AKUN
    }
  })

  res.status(200).json({
    status: 'success',
    message: `Berhasil mendapatkan user dengan username ${username}`,
    data: {
      akunData: findUser,
      customerData: userCredentials
    }
  })
}

module.exports = {
  addUser,
  getAllUserWithCredentials,
  getUserDataByUsername
}