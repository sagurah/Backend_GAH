const prisma = require('../prisma/index')

const addFasilitasTambahan = async (req, res) => {
  const newData = req.body

  try {
    const result = await prisma.fasilitas_Tambahan.create({
      data: newData
    })

    res.status(200).json({
      status: 'success',
      message: 'Data fasilitas tambahan berhasil ditambahkan',
      data: result
    })
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: `Data season gagal ditambahkan
      Trace: ${err.message}`
    })
  }
}

const getAllFasilitasTambahan = async (req, res) => {
  try {
    const result = await prisma.fasilitas_Tambahan.findMany()

    if(result.length === 0){
      return res.status(200).json({
        status: 'success',
        message: 'Data fasilitas tambahan kosong'
      })
    }

    res.status(200).json({
      status: 'success',
      message: 'Data fasilitas tambahan berhasil didapatkan',
      data: result
    })
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: `Data fasilitas tambahan gagal didapatkan
      Trace: ${err.message}`
    })
  }
}

const getFasilitasTambahanByNama = async (req, res) => {
  const nama = req.params.nama

  try {
    const result = await prisma.fasilitas_Tambahan.findMany({
      where: {
        NAMA_FASILITAS: nama
      }
    })

    if(result.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: `Data fasilitas tambahan dengan nama ${nama} tidak ditemukan`
      })
    }

    res.status(200).json({
      status: 'success',
      message: `Data fasilitas tambahan dengan nama berhasil didapatkan`,
      data: result
    })
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: `Data season gagal didapatkan
      Trace: ${err.message}`
    })
  }
}

const updateFasilitasTambahan = async (req, res) => {
  const id = req.params.id
  const newData = req.body

  try {
    const findFasilitasTambahan = await prisma.fasilitas_Tambahan.findUnique({
      where: {
        ID_FASILITAS: parseInt(id)
      }
    })

    if(!findFasilitasTambahan) {
      return res.status(404).json({
        status: 'success',
        message: `Data fasilitas tambahan dengan id ${id} tidak ditemukan`
      })
    }

    const result = await prisma.fasilitas_Tambahan.update({
      where: {
        ID_FASILITAS: parseInt(id)
      },

      data: newData
    })

    res.status(200).json({
      status: 'success',
      message: 'Data fasilitas tambahan berhasil diupdate',
      data: result
    })
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: `Data fasilitas tambahan gagal diupdate
      Trace: ${err.message}`
    })
  }
}

const deleteFasilitasTambahan = async (req, res) => {
  const id = req.params.id

  try {
    const findFasilitasTambahan = await prisma.fasilitas_Tambahan.findUnique({
      where: {
        ID_FASILITAS: parseInt(id)
      }
    })

    if(!findFasilitasTambahan) {
      return res.status(404).json({
        status: 'success',
        message: `Data fasilitas tambahan dengan id ${id} tidak ditemukan`
      })
    }

    const result = await prisma.fasilitas_Tambahan.delete({
      where: {
        ID_FASILITAS: parseInt(id)
      }
    })

    res.status(200).json({
      status: 'success',
      message: 'Data fasilitas tambahan berhasil dihapus',
      data: result
    })
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: `Data fasilitas tambahan gagal dihapus
      Trace: ${err.message}`
    })
  }
}

module.exports = {
  addFasilitasTambahan,
  getAllFasilitasTambahan,
  getFasilitasTambahanByNama,
  updateFasilitasTambahan,
  deleteFasilitasTambahan
}