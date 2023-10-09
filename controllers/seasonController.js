const prisma = require('../prisma/index')

const addSeason = async (req, res) => {
  const newData = req.body

  try {
    const result = await prisma.season.create({
      data: newData
    })

    res.status(200).json({
      status: 'success',
      message: 'Data season berhasil ditambahkan',
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

const getAllSeason = async (req, res) => {
  try {
    const result = await prisma.season.findMany()

    if(result.length === 0){
      return res.status(200).json({
        status: 'success',
        message: 'Data season kosong'
      })
    }

    res.status(200).json({
      status: 'success',
      message: 'Data season berhasil didapatkan',
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

const getSeasonByJenis = async (req, res) => {
  const jenis = req.params.jenis

  try {
    const result = await prisma.season.findMany({
      where: {
        JENIS_SEASON: jenis
      }
    })

    if(result.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: `Tidak ada data season dengan jenis ${jenis}`
      })
    }

    res.status(200).json({
      status: 'success',
      message: 'Data season berhasil didapatkan',
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

const updateSeason = async (req, res) => {
  const id = req.params.id
  const newData = req.body

  try {
    const season = await prisma.season.findUnique({
      where: {
        ID_SEASON: parseInt(id)
      }
    })

    if(!season) {
      return res.status(404).json({
        status: 'success',
        message: `Tidak ada data season dengan id ${id}`
      })
    }

    const result = await prisma.season.update({
      where: {
        ID_SEASON: parseInt(id)
      },

      data: newData
    })

    res.status(200).json({
      status: 'success',
      message: 'Data season berhasil diupdate',
      data: result
    })
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: `Data season gagal diupdate
      Trace: ${err.message}`
    })
  }
}

const deleteSeason = async (req, res) => {
  const id = req.params.id

  try {
    const season = await prisma.season.findUnique({
      where: {
        ID_SEASON: parseInt(id)
      }
    })

    if(!season) {
      return res.status(404).json({
        status: 'error',
        message: `Tidak ada data season dengan id ${id}`
      })
    }

    const result = await prisma.season.delete({
      where: {
        ID_SEASON: parseInt(id)
      }
    })

    res.status(200).json({
      status: 'success',
      message: 'Data season berhasil dihapus',
      data: result
    })
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: `Data season gagal dihapus
      Trace: ${err.message}`
    })
  }
}

module.exports = {
  addSeason,
  getAllSeason,
  getSeasonByJenis,
  updateSeason,
  deleteSeason
}