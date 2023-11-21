const prisma = require('../prisma/index')

const today = new Date()
today.setHours(0, 0, 0, 0)

const generateInvoiceNumber = (date, id) => {
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  
  const value = `P${day}${month}${year}-${id}`

  return value
}

const generateInvoiceNumberGroup = (date, id) => {
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  
  const value = `G${day}${month}${year}-${id}`

  return value
}

const checkOut = async (req, res) => {
  const idReservasi = req.params.id

  try {
    const updateReservasi = await prisma.reservasi.update({
      where: {
        ID_RESERVASI: parseInt(idReservasi)
      },
      data: {
        STATUS: parseInt(3)
      }
    })

    const findInvoice = await prisma.invoice.findFirst({
      where: {
        ID_RESERVASI: parseInt(idReservasi)
      }
    })

    const updateInvoice = await prisma.invoice.update({
      where: {
        ID_INVOICE: findInvoice.ID_INVOICE
      },
      data: {
        SISA_KEKURANGAN: findInvoice.DEPOSIT - findInvoice.TAX,
        TGL_PELUNASAN: new Date(today)
      }
    })

    res.status(200).json({
      status: 'success',
      message: 'checkout berhasil dilakukan',
      data: {
        reservasi: updateReservasi,
        invoice: updateInvoice
      }
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: `Internal server error
      Trace: ${error.message}`
    })
  }
}

const checkOutGroup = async (req, res) => {
  const idReservasi = req.params.id

  try {
    const updateReservasi = await prisma.reservasi.update({
      where: {
        ID_RESERVASI: parseInt(idReservasi)
      },
      data: {
        STATUS: parseInt(3)
      }
    })

    const findInvoice = await prisma.invoice.findFirst({
      where: {
        ID_RESERVASI: parseInt(idReservasi)
      }
    })

    const updateInvoice = await prisma.invoice.update({
      where: {
        ID_INVOICE: findInvoice.ID_INVOICE
      },
      data: {
        SISA_KEKURANGAN: findInvoice.DEPOSIT - findInvoice.TAX - findInvoice.JAMINAN,
        TGL_PELUNASAN: new Date(today)
      }
    })

    res.status(200).json({
      status: 'success',
      message: 'checkout berhasil dilakukan',
      data: {
        reservasi: updateReservasi,
        invoice: updateInvoice
      }
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: `Internal server error
      Trace: ${error.message}`
    })
  }
}

const checkIn = async (req, res) => {
  const { totalHarga, idFO, idReservasi } = req.body

  try {
    // Find ID Pegawai Front Office
    const pegawaiFO = await prisma.pegawai.findFirst({
      where: {
        ID_AKUN: parseInt(idFO)
      }
    })

    // Add Front Office as a Pegawai in Reservasi and Update Status Reservasi
    const updateReservasi = await prisma.reservasi.update({
      where: {
        ID_RESERVASI: parseInt(idReservasi)
      },
      data: {
        STATUS: parseInt(2),
        ID_PEGAWAI: pegawaiFO.ID_PEGAWAI
      }
    })

    // Create Invoice
    let result = await prisma.invoice.create({
      data: {
        TAX: parseFloat(totalHarga) * 0.1,
        TGL_PELUNASAN: new Date(today),
        JAMINAN: parseFloat(0),
        DEPOSIT: parseFloat(300000),
        SISA_KEKURANGAN: parseFloat(0),
        ID_RESERVASI: parseInt(idReservasi),
      }
    })

    const invoiceNumber = generateInvoiceNumber(today, result.ID_INVOICE)

    // Update Invoice Number
    result = await prisma.invoice.update({
      where: {
        ID_INVOICE: result.ID_INVOICE
      }, 
      data: {
        NO_INVOICE: invoiceNumber
      }
    })

    res.status(200).json({
      status: 'success',
      message: 'Checkin berhasil dilakukan, invoice berhasil dibuat',
      data: {
        invoice: result,
        reservasi: updateReservasi
      }
    })

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: `Internal server error
      Trace : ${error.message}`
    })
  }
}

const checkInGroup = async (req, res) => {
  const { totalHarga, idFO, idReservasi } = req.body

  try {
    // Find ID Pegawai Front Office
    const pegawaiFO = await prisma.pegawai.findFirst({
      where: {
        ID_AKUN: parseInt(idFO)
      }
    })

    // Add Front Office as a Pegawai in Reservasi
    const updateReservasi = await prisma.reservasi.update({
      where: {
        ID_RESERVASI: parseInt(idReservasi)
      },
      data: {
        ID_PEGAWAI: pegawaiFO.ID_PEGAWAI,
        STATUS: parseInt(2)
      }
    })

    // Create Invoice
    let result = await prisma.invoice.create({
      data: {
        TAX: parseFloat(totalHarga) * 0.1,
        JAMINAN: parseFloat(totalHarga) * 0.5,
        TGL_PELUNASAN: new Date(today),
        DEPOSIT: parseFloat(300000),
        SISA_KEKURANGAN: parseFloat(0),
        ID_RESERVASI: parseInt(idReservasi),
      }
    })

    const invoiceNumber = generateInvoiceNumberGroup(today, result.ID_INVOICE)

    // Update Invoice Number
    result = await prisma.invoice.update({
      where: {
        ID_INVOICE: result.ID_INVOICE
      }, 
      data: {
        NO_INVOICE: invoiceNumber
      }
    })

    res.status(200).json({
      status: 'success',
      message: 'Checkin berhasil dilakukan, invoice berhasil dibuat',
      data: {
        invoice: result,
        reservasi: updateReservasi
      }
    })

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: `Internal server error
      Trace : ${error.message}`
    })
  }
}

const addFasilitasToReservasi = async (req, res) => {
  try {
    const idReservasi = req.params.id
    const { idFasilitas } = req.body

    // Find Related Reservasi
    const findReservasi = await prisma.reservasi.findFirst({
      where: {
        ID_RESERVASI: parseInt(idReservasi)
      },
    })

    // Find Related Fasilitas
    const findFasilitas = await prisma.fasilitas_Tambahan.findFirst({
      where: {
        ID_FASILITAS: parseInt(idFasilitas)
      }
    })

    // Calculate Total Harga Fasilitas
    const totalHarga = parseFloat(findFasilitas.HARGA)

    // Create Detail Reservasi Fasilitas
    const createDetailReservasiFasilitas = await prisma.detail_Reservasi_Fasilitas.create({
      data: {
        JUMLAH: parseInt(1),
        TOTAL_HARGA_FASILITAS: parseFloat(totalHarga),
        ID_RESERVASI: parseInt(idReservasi),
        ID_FASILITAS: parseInt(idFasilitas)
      }
    })

    const findInvoice = await prisma.invoice.findFirst({
      where: {
        ID_RESERVASI: parseInt(idReservasi)
      }
    })

    const updateInvoice = await prisma.invoice.update({
      where: {
        ID_INVOICE: findInvoice.ID_INVOICE
      }, 
      data: {
        DEPOSIT: {
          decrement: parseFloat(totalHarga)
        }
      }
    })

    res.status(200).json({
      status: 'success',
      message: 'berhasil menambahkan fasilitas ke reservasi',
      data: {
        detailReservasiFasilitas: createDetailReservasiFasilitas,
        invoice: updateInvoice
      }
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: `Internal server error
      Trace: ${error.message}`
    })
  }
}

module.exports = {
  checkIn,
  checkInGroup,
  addFasilitasToReservasi,
  checkOut,
  checkOutGroup
}