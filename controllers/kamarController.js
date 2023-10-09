const prisma = require('../prisma/index')

const getAllKamar = async (req, res) => {

  try {
    const kamars = await prisma.kamar.findMany() 

    if(kamars.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'Tidak ada data kamar',
      })
    }

    res.status(200).json({
      status: 'success',
      message: 'Data kamar berhasil didapatkan',
      data: kamars
    })

  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'Data kamar gagal didapatkan'
    })
  }

}

const getKamarByJenis = async (req, res) => {
  const jenisKamar = req.params.jenis

  try {
    const kamars = await prisma.kamar.findMany({
      where: {
        JENIS_KAMAR: jenisKamar
      }
    })

    if(kamars.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: `Tidak ada data kamar dengan jenis ${jenisKamar}`
      })
    }

    res.status(200).json({
      status: 'success',
      message: 'Data kamar berhasil didapatkan',
      data: kamars
    })
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: `Data kamar gagal didapatkan
      Trace: ${err.message}`
    })
  }
}

const addKamar = async (req, res) => {
  const newKamar = req.body

  try {
    const result = await prisma.kamar.create({
      data: newKamar
    })

    res.status(200).json({ 
      status: 'success',
      message: 'Data kamar berhasil ditambahkan',
      data: result 
    })
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: `Data kamar gagal ditambahkan
      Trace: ${err.message}`,
    })
  } 

}

const updateKamar = async (req, res) => {
  const id = req.params.id
  const updatedKamar = req.body

  try{
    const kamar = await prisma.kamar.findUnique({
      where: {
        ID_KAMAR: parseInt(id)
      }
    })

    if(!kamar) {
      return res.status(404).json({
        status: 'error',
        message: `Tidak ada data kamar dengan id ${id}`
      })
    }

    const result = await prisma.kamar.update({
      where: {
        ID_KAMAR: parseInt(id)
      },
  
      data: updatedKamar
    })

    res.status(200).json({
      status: 'success',
      message: 'Data kamar berhasil diperbarui',
      data: result
    })
  } catch(err) {
    return res.status(400).json({
      status: 'error',
      message: `Data kamar gagal diperbarui
      Trace: ${err.message}`,
    })
  }

}

const deleteKamar = async (req, res) => {
  const id = req.params.id

  try {
    const kamar = await prisma.kamar.findUnique({
      where: {
        ID_KAMAR: parseInt(id)
      }
    })

    if(!kamar) {
      return res.status(404).json({
        status: 'error',
        message: `Tidak ada data kamar dengan id ${id}`
      })
    }

    const result = await prisma.kamar.delete({
      where: {
        ID_KAMAR: parseInt(id)
      }
    })

    res.status(200).json({
      status: 'success',
      message: 'Data kamar berhasil dihapus',
      data: result
    })
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: `Data kamar gagal dihapus
      Trace: ${err.message}`,
    })
  }

}

module.exports = {
  getAllKamar,
  getKamarByJenis,
  addKamar,
  updateKamar,
  deleteKamar
}