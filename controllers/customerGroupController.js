const prisma = require('../prisma/index')

const addCustomerGroup = async (req, res) => {
  const newData = req.body

  try {
    const result = await prisma.customer.create({
      data: {
        NAMA_CUSTOMER: newData.NAMA_CUSTOMER,
        JENIS_CUSTOMER: "Group",
        NAMA_INSTITUSI: newData.NAMA_INSTITUSI,
        NO_TELP: newData.NO_TELP,
        EMAIL: newData.EMAIL,
        ALAMAT: newData.ALAMAT,
        ID_AKUN: parseInt(newData.ID_AKUN)
      }
    })

    res.status(200).json({
      status: 'success',
      message: 'Data customer group berhasil ditambahkan',
      data: result
    })
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: `Data customer group gagal ditambahkan
      Trace: ${err.message}`
    })
  }
}

const getAllCustomerGroup = async (req, res) => {
  const id = req.params.id

  try {
    const result = await prisma.customer.findMany({
      where: {
        ID_AKUN: parseInt(id),
        JENIS_CUSTOMER: "Group"
      }
    })

    if(result.length === 0){
      return res.status(200).json({
        status: 'success',
        message: 'Data customer group kosong'
      })
    }

    res.status(200).json({
      status: 'success',
      message: 'Data customer group berhasil didapatkan',
      data: result
    })
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: `Data customer group gagal didapatkan
      Trace: ${err.message}`
    })
  }
}

module.exports = {
  addCustomerGroup,
  getAllCustomerGroup
}