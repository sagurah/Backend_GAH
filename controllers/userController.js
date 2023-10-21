const prisma = require('../prisma/index')
const { encryptPassword, comparePassword } = require('../utils/hashPassword')

const getProfile = async (req, res) => {
  const username = req.currentUser.USERNAME

  const findUser = await prisma.akun.findFirst({
    where: {
      USERNAME: username
    },
    include: {
      customer: true
    },
  })

  if(!findUser) {
    return res.status(404).json({
      status: 'error',
      message: `User dengan username ${username} tidak ditemukan`
    })
  }

  res.status(200).json({
    status: 'success',
    message: `Berhasil mendapatkan user dengan username ${username}`,
    data: findUser
  })
}

const editAkun = async (req, res) => {
  const username = req.currentUser.USERNAME
  const newData = req.body

  try {
    const findUser = await prisma.akun.findFirst({
      where: {
        USERNAME: username
      },
    })
  
    if(!findUser) {
      return res.status(404).json({
        status: 'error',
        message: `User dengan username ${username} tidak ditemukan`
      })
    }
  
    const checkPassword = await comparePassword(newData.oldPassword, findUser.PASSWORD)
    if(!checkPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Password tidak sesuai'
      })
    }
  
    const result = await prisma.akun.update({
      where: {
        USERNAME: username
      },
      data: {
        PASSWORD: await encryptPassword(newData.newPassword)
      }
    })

    res.status(200).json({
      status: 'success',
      message: `Berhasil mengupdate data akun ${username}`,
      data: result
    })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: `Internal server error
      Trace: ${err.message}`
    })
  }
}

const editProfile = async (req, res) => {
  const username = req.currentUser.USERNAME
  const newData = req.body

  try {
    const findUser = await prisma.akun.findFirst({
      where: {
        USERNAME: username
      },
      include: {
        customer: true
      }
    })

    if(!findUser) {
      return res.status(404).json({
        status: 'error',
        message: `User dengan username ${username} tidak ditemukan`
      })
    }

    const result = await prisma.customer.update({
      where: {
        ID_CUSTOMER: findUser.customer[0].ID_CUSTOMER
      },

      data: {
        NAMA_CUSTOMER: newData.NAMA_CUSTOMER,
        NAMA_INSTITUSI: newData.NAMA_INSTITUSI,
        ALAMAT: newData.ALAMAT,
        NO_TELP: newData.NO_TELP,
        EMAIL: newData.EMAIL,
      }
    })

    res.status(200).json({
      status: 'success',
      message: `Berhasil mengupdate data profile ${username}`,
      data: result
    })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: `Internal server error
      Trace: ${err.message}`
    })
  }
}

const getRiwayatReservasi = async (req, res) => {
  const user = req.currentUser
  const idAkun = user.ID_AKUN

  try {
    const customer = await prisma.customer.findFirst({
      where: {
        ID_AKUN: idAkun
      }
    })
  
    if(!customer) {
      const pegawai = await prisma.pegawai.findFirst({
        where: {
          ID_AKUN: idAkun
        }
      })

      if(!pegawai) {
        return res.status(404).json({
          status: 'error',
          message: 'Data customer tidak ditemukan'
        })
      }

      const riwayatTransaksi = await prisma.reservasi.findMany({
        where: {
          ID_PEGAWAI: pegawai.ID_PEGAWAI
        }
      })

      return res.status(200).json({
        status: 'success',
        message: 'Riwayat transaksi pegawai berhasil didapatkan',
        data: riwayatTransaksi
      })
    }
  
    const idCustomer = customer.ID_CUSTOMER
  
    const riwayatTransaksi = await prisma.reservasi.findMany({
      where: {
        ID_CUSTOMER: idCustomer
      },
    })
  
    res.status(200).json({
      status: 'success',
      message: 'Riwayat transaksi customer berhasil didapatkan',
      data: riwayatTransaksi
    })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: `Internal server error
      Trace: ${err.message}`
    })
  }
}

const getDetailRiwayatReservasi = async (req, res) => {
  const idReservasi = req.params.id

  try {
    const detailRiwayatTransaksi = await prisma.reservasi.findFirst({
      where: {
        ID_RESERVASI: parseInt(idReservasi)
      },
      include: {
        invoice: true,
        detail_reservasi_fasilitas: true,
        detail_reservasi_kamar: true
      }
    })

    if(!detailRiwayatTransaksi) {
      return res.status(404).json({
        status: 'error',
        message: 'Riwayat transaksi tidak ditemukan'
      })
    }

    res.status(200).json({
      status: 'success',
      message: 'Detail riwayat transaksi berhasil didapatkan',
      data: detailRiwayatTransaksi
    })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: `Internal server error
      Trace: ${err.message}`
    })
  }
}

module.exports = {
  getProfile,
  editAkun,
  editProfile,
  getRiwayatReservasi,
  getDetailRiwayatReservasi
}