const prisma = require('../prisma/index')

const today = new Date()
today.setHours(0, 0, 0, 0)

const generateReservationNumber = (date, id) => {
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  const value = `P${day}${month}${year}-${id}`

  return value
}

const generateReservationNumberSM = (date, id) => {
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  const value = `G${day}${month}${year}-${id}`

  return value
}

const addTransaksiCustomer = async (req, res) => {
  const { 
    tglReservasi, 
    tglCheckin, 
    tglCheckout, 
    jmlDewasa, 
    jmlAnak, 
    totalBayar, 
    idAkun,
    hargaKamar,
    hargaFasilitas,
    kamarTarifIds,
    fasilitasIds
  } = req.body

  const checkinDate = new Date(tglCheckin);
  const checkoutDate = new Date(tglCheckout);
  const diffDays = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
  
  const findCustomer = await prisma.customer.findFirst({
    where: {
      ID_AKUN: parseInt(idAkun)
    }
  })

  try {
    let result = await prisma.reservasi.create({
      data: {
        TGL_RESERVASI: new Date(tglReservasi),
        TGL_CHECKIN: new Date(tglCheckin),
        TGL_CHECKOUT: new Date(tglCheckout),
        JML_DEWASA: parseInt(jmlDewasa),
        JML_ANAK: parseInt(jmlAnak),
        TOTAL_BAYAR: parseFloat(totalBayar),
        STATUS: 0,
        CREATED_AT_MONTH: today.toLocaleString('en-US', { month: 'long' }),
        CREATED_AT_YEAR: today.getFullYear().toString(),
        JENIS_CUSTOMER: 'Personal',
        ID_CUSTOMER: parseInt(findCustomer.ID_CUSTOMER),
      }
    })

    const reservationNumber = generateReservationNumber(new Date(tglReservasi), result.ID_RESERVASI)

    result = await prisma.reservasi.update({
      where: {
        ID_RESERVASI: result.ID_RESERVASI
      },
      data: {
        NO_RESERVASI: reservationNumber
      }
    })

    const kamar = []
    const fasilitas = []

    for(let i = 0; i < kamarTarifIds.length; i++) {
      const id = kamarTarifIds[i]
      const harga = hargaKamar[i]

      const kamarBaru = await prisma.detail_Reservasi_Kamar.create({
        data: {
          JUMLAH: 1,
          ID_TARIF: parseInt(id),
          ID_RESERVASI: parseInt(result.ID_RESERVASI),
          TOTAL_HARGA_KAMAR: parseFloat(harga) * diffDays
        }
      })

      const kamarDetails = await prisma.tarif.findFirst({
        where: {
          ID_TARIF: parseInt(id)
        },
        include: {
          kamar: true
        }
      })

      kamar.push({ 
        kamarBaru,
        detailKamar: kamarDetails
      })
    }

    for(let i = 0; i < fasilitasIds.length; i++) {
      const id = fasilitasIds[i]
      const harga = hargaFasilitas[i]

      const fasilitasBaru = await prisma.detail_Reservasi_Fasilitas.create({
        data: {
          JUMLAH: 1,
          ID_FASILITAS: parseInt(id),
          ID_RESERVASI: parseInt(result.ID_RESERVASI),
          TOTAL_HARGA_FASILITAS: parseFloat(harga),
        }
      })

      const fasilitasDetails = await prisma.fasilitas_Tambahan.findFirst({
        where: {
          ID_FASILITAS: parseInt(id)
        },
      })

      fasilitas.push({
        fasilitasBaru,
        detailFasilitas: fasilitasDetails
      })
    }

    res.status(201).json({
      status: 'success',
      message: 'Data berhasil ditambahkan',
      data: {
        reservasi: result,
        kamar,
        fasilitas
      }
    })
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: `Data gagal ditambahkan:
      Trace: ${error.message}`
    })
  }
}

const addTransaksiSM = async (req, res) => {
  const { 
    tglReservasi, 
    tglCheckin, 
    tglCheckout, 
    jmlDewasa, 
    jmlAnak, 
    totalBayar, 
    idCustomer,
    hargaKamar,
    hargaFasilitas,
    kamarTarifIds,
    fasilitasIds
  } = req.body

  const checkinDate = new Date(tglCheckin);
  const checkoutDate = new Date(tglCheckout);
  const diffDays = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));

  try {
    let result = await prisma.reservasi.create({
      data: {
        TGL_RESERVASI: new Date(tglReservasi),
        TGL_CHECKIN: new Date(tglCheckin),
        TGL_CHECKOUT: new Date(tglCheckout),
        JML_DEWASA: parseInt(jmlDewasa),
        JML_ANAK: parseInt(jmlAnak),
        TOTAL_BAYAR: parseFloat(totalBayar),
        STATUS: 0,
        CREATED_AT_MONTH: today.toLocaleString('en-US', { month: 'long' }),
        CREATED_AT_YEAR: today.getFullYear().toString(),
        JENIS_CUSTOMER: 'Group',
        ID_CUSTOMER: parseInt(idCustomer),
      }
    })

    const reservationNumber = generateReservationNumberSM(new Date(tglReservasi), result.ID_RESERVASI)

    result = await prisma.reservasi.update({
      where: {
        ID_RESERVASI: result.ID_RESERVASI
      },
      data: {
        NO_RESERVASI: reservationNumber
      }
    })

    const kamar = []
    const fasilitas = []

    for(let i = 0; i < kamarTarifIds.length; i++) {
      const id = kamarTarifIds[i]
      const harga = hargaKamar[i]

      const kamarBaru = await prisma.detail_Reservasi_Kamar.create({
        data: {
          JUMLAH: 1,
          ID_TARIF: parseInt(id),
          ID_RESERVASI: parseInt(result.ID_RESERVASI),
          TOTAL_HARGA_KAMAR: parseFloat(harga) * diffDays
        }
      })

      const kamarDetails = await prisma.tarif.findFirst({
        where: {
          ID_TARIF: parseInt(id)
        },
        include: {
          kamar: true
        }
      })

      kamar.push({ 
        kamarBaru,
        detailKamar: kamarDetails
      })
    }

    for(let i = 0; i < fasilitasIds.length; i++) {
      const id = fasilitasIds[i]
      const harga = hargaFasilitas[i]

      const fasilitasBaru = await prisma.detail_Reservasi_Fasilitas.create({
        data: {
          JUMLAH: 1,
          ID_FASILITAS: parseInt(id),
          ID_RESERVASI: parseInt(result.ID_RESERVASI),
          TOTAL_HARGA_FASILITAS: parseFloat(harga),
        }
      })

      const fasilitasDetails = await prisma.fasilitas_Tambahan.findFirst({
        where: {
          ID_FASILITAS: parseInt(id)
        },
      })

      fasilitas.push({
        fasilitasBaru,
        detailFasilitas: fasilitasDetails
      })
    }

    res.status(201).json({
      status: 'success',
      message: 'Data berhasil ditambahkan',
      data: {
        reservasi: result,
        kamar,
        fasilitas
      }
    })
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: `Data gagal ditambahkan:
      Trace: ${error.message}`
    })
  }
}

const getKamarReady = async (req, res) => {
  let { startDate, endDate } = req.query

  startDate = new Date(startDate)
  endDate = new Date(endDate)

  if(!startDate || !endDate) {
    return res.status(400).json({
      status: 'error',
      message: 'start date dan end date harus diisi.',
    })
  }

  if(startDate > endDate) {
    return res.status(400).json({
      status: 'error',
      message: 'start date tidak boleh lebih dari end date.',
    })
  }

  if(startDate < today) {
    return res.status(400).json({
      status: 'error',
      message: 'start date tidak boleh kurang dari hari ini.',
    })
  }

  try {
    const result = await prisma.kamar.findMany({
      where: {
        NOT: {
          tarif: {
            some: {
              detail_reservasi_kamar: {
                some: {
                  reservasi: {
                    STATUS: {
                      in: [1, 2] 
                    },
                    TGL_CHECKIN: {
                      lte: endDate
                    },
                    TGL_CHECKOUT: {
                      gte: startDate
                    }
                  }
                }
              }
            }
          }
        }
      },
      include: {
        tarif: {
          include: {
            season: true,
          },
        },
      },
    });
    

    if (result.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Data tidak ditemukan',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Data berhasil ditemukan',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: `Data gagal ditemukan:
      Trace: ${error.message}`,
    });
  }
};

const finishTransaksi = async (req, res) => {
  const { idReservasi } = req.body

  try {
    const result = await prisma.reservasi.update({
      where: {
        ID_RESERVASI: parseInt(idReservasi)
      },
      data: {
        STATUS: 1
      }
    })

    res.status(200).json({
      status: 'success',
      message: 'Data berhasil diupdate',
      data: result
    })
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: `Data gagal diupdate:
      Trace: ${error.message}`
    })
  }
}

const cancelTransaksi = async (req, res) => {
  const { id } = req.params

  try {
    const deletedKamar = await prisma.detail_Reservasi_Kamar.deleteMany({
      where: {
        ID_RESERVASI: parseInt(id)
      }
    })

    const deletedFasilitas = await prisma.detail_Reservasi_Fasilitas.deleteMany({
      where: {
        ID_RESERVASI: parseInt(id)
      }
    })

    const deletedTransaksi = await prisma.reservasi.delete({
      where: {
        ID_RESERVASI: parseInt(id)
      }
    })

    res.status(200).json({
      status: 'success',
      message: 'Transaksi berhasil dibatalkan',
      data: {
        deletedTransaksi,
        deletedKamar,
        deletedFasilitas
      }
    })
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: `Transaksi gagal dibatalkan
      Trace: ${error.message}`
    })
  }
}

module.exports = {
  addTransaksiCustomer,
  addTransaksiSM,
  getKamarReady,
  finishTransaksi,
  cancelTransaksi
}