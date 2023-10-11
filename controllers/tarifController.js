const prisma = require('../prisma/index')

const addTarif = async (req, res) => {
  const newData = req.body

  if(!newData) {
    return res.status(400).json({
      status: 'error',
      message: 'Data tarif tidak boleh kosong'
    })
  }

  try {
    const result = await prisma.tarif.create({
      data: newData
    })

    res.status(200).json({
      status: 'success',
      message: 'Data tarif berhasil ditambahkan',
      data: result
    })
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: `Data tarif gagal ditambahkan
      Trace: ${err.message}`
    })
  }
}

const getAllTarif = async (req, res) => {
  try {
    const result = await prisma.tarif.findMany()

    if(result.length === 0){
      return res.status(200).json({
        status: 'success',
        message: 'Data tarif kosong'
      })
    }

    res.status(200).json({
      status: 'success',
      message: 'Data tarif berhasil didapatkan',
      data: result
    })
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: `Data tarif gagal didapatkan
      Trace: ${err.message}`
    })
  }
}

const getTarifByRangeHarga = async (req, res) => {
  const { minHarga, maxHarga } = req.params

  if(!minHarga || !maxHarga) {
    return res.status(400).json({
      status: 'error',
      message: 'Range harga tidak boleh kosong'
    })
  }

  try {
    const result = await prisma.tarif.findMany({
      where: {
        TOTAL_TARIF: {
          gte: parseFloat(minHarga),
          lte: parseFloat(maxHarga)
        }
      }
    })
  
    if(result.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: `Data dengan rentang tarif ${minHarga} - ${maxHarga} tidak ditemukan`
      })
    }
  
    res.status(200).json({
      status: 'success',
      message: 'Data tarif berhasil didapatkan',
      data: result
    })
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: `Data tarif gagal didapatkan
      Trace : ${err.message}`
    })
  }
}

const updateTarif = async (req, res) => {
  const id = req.params.id
  const newData = req.body

  if(!id) {
    return res.status(400).json({
      status: 'error',
      message: 'Parameter id tidak boleh kosong'
    })
  }

  try {
    const findTarif = await prisma.tarif.findUnique({
      where: {
        ID_TARIF: parseInt(id)
      }
    })

    if(!findTarif) {
      return res.status(404).json({
        status: 'error',
        message: `Data tarif dengan id ${id} tidak ditemukan`
      })
    }

    const result = await prisma.tarif.update({
      where: {
        ID_TARIF: parseInt(id)
      },

      data: newData
    })

    res.status(200).json({
      status: 'success',
      message: 'Data tarif berhasil diupdate',
      data: result
    })
    
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: `Data tarif gagal diupdate
      Trace: ${err.message}`
    })
  }
}

const deleteTarif = async (req, res) => {
  const id = req.params.id

  if(!id) {
    return res.status(400).json({
      status: 'error',
      message: 'Parameter id tidak boleh kosong'
    })
  }

  try {
    const findTarif = await prisma.tarif.findUnique({
      where: {
        ID_TARIF: parseInt(id)
      }
    })
    
    if(!findTarif) {
      return res.status(404).json({
        status: 'error',
        message: `Data tarif dengan id ${id} tidak ditemukan`
      })
    }

    const result = await prisma.tarif.delete({
      where: {
        ID_TARIF: parseInt(id)
      }
    })

    res.status(200).json({
      status: 'success',
      message: 'Data tarif berhasil dihapus',
      data: result
    })  
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: `Data tarif gagal dihapus
      Trace: ${err.message}`
    })
  }
}

module.exports = {
  addTarif,
  getAllTarif,
  getTarifByRangeHarga,
  updateTarif,
  deleteTarif
}