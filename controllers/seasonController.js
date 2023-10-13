const prisma = require('../prisma/index')

const today = new Date()
const plusTwoMonths = new Date().setMonth(today.getMonth() + 2)

const addSeason = async (req, res) => {
  const newData = req.body

  const tglMulai = new Date(newData.TGL_MULAI)
  const tglAkhir = new Date(newData.TGL_AKHIR)

  if(tglMulai < plusTwoMonths) {
    return res.status(400).json({
      status: 'error',
      message: 'Tanggal mulai harus lebih dari atau sama dengan 2 bulan sebelum hari ini'
    })
  }

  if(tglAkhir < tglMulai) {
    return res.status(400).json({
      status: 'error',
      message: 'Tanggal akhir harus lebih dari atau sama dengan tanggal mulai'
    })
  }

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

const getSeasonByRangeDate = async (req, res) => {
  const startDate = req.params.startDate
  const endDate = req.params.endDate

  try {
    const result = await prisma.season.findFirst({
      where: {
        TGL_MULAI: {
          gte: new Date(startDate)
        },
        TGL_AKHIR: {
          lte: new Date(endDate)
        }
      }
    })

    if(!result) {
      return res.status(200).json({
        status: 'success',
        message: `Tidak ada data season dalam rentang ${startDate} hingga ${endDate}`
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

  const tglMulai = new Date(newData.TGL_MULAI)
  const tglAkhir = new Date(newData.TGL_AKHIR)

  if(tglMulai < plusTwoMonths) {
    return res.status(400).json({
      status: 'error',
      message: 'Tanggal mulai harus lebih dari atau sama dengan 2 bulan sebelum hari ini'
    })
  }

  if(tglAkhir < tglMulai) {
    return res.status(400).json({
      status: 'error',
      message: 'Tanggal akhir harus lebih dari atau sama dengan tanggal mulai'
    })
  }

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
  getSeasonByRangeDate,
  updateSeason,
  deleteSeason
}