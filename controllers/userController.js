const prisma = require("../prisma/index");
const { encryptPassword, comparePassword } = require("../utils/hashPassword");

const getProfileById = async (req, res) => {
  const id = req.params.id;

  const findUser = await prisma.akun.findFirst({
    where: {
      ID_AKUN: parseInt(id),
    },
    include: {
      customer: true,
    },
  });

  if (!findUser) {
    return res.status(404).json({
      status: "error",
      message: `User dengan id ${id} tidak ditemukan`,
    });
  }

  res.status(200).json({
    status: "success",
    message: `Berhasil mendapatkan user dengan id ${id}`,
    data: findUser,
  });
};

const getProfile = async (req, res) => {
  const username = req.currentUser.USERNAME;

  const findUser = await prisma.akun.findFirst({
    where: {
      USERNAME: username,
    },
    include: {
      customer: true,
    },
  });

  if (!findUser) {
    return res.status(404).json({
      status: "error",
      message: `User dengan username ${username} tidak ditemukan`,
    });
  }

  res.status(200).json({
    status: "success",
    message: `Berhasil mendapatkan user dengan username ${username}`,
    data: findUser,
  });
};

const editAkun = async (req, res) => {
  const username = req.currentUser.USERNAME;
  const newData = req.body;

  try {
    const findUser = await prisma.akun.findFirst({
      where: {
        USERNAME: username,
      },
    });

    if (!findUser) {
      return res.status(404).json({
        status: "error",
        message: `User dengan username ${username} tidak ditemukan`,
      });
    }

    const checkPassword = await comparePassword(
      newData.oldPassword,
      findUser.PASSWORD
    );
    if (!checkPassword) {
      return res.status(400).json({
        status: "error",
        message: "Password tidak sesuai",
      });
    }

    const result = await prisma.akun.update({
      where: {
        USERNAME: username,
      },
      data: {
        PASSWORD: await encryptPassword(newData.newPassword),
      },
    });

    res.status(200).json({
      status: "success",
      message: `Berhasil mengupdate data akun ${username}`,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: `Internal server error
      Trace: ${err.message}`,
    });
  }
};

const editAkunMobile = async (req, res) => {
  const newData = req.body;

  try {
    const findUser = await prisma.akun.findFirst({
      where: {
        USERNAME: newData.username,
      },
    });

    if (!findUser) {
      return res.status(404).json({
        status: "error",
        message: `User dengan username ${newData.username} tidak ditemukan`,
      });
    }

    const checkPassword = await comparePassword(
      newData.oldPassword,
      findUser.PASSWORD
    );
    if (!checkPassword) {
      return res.status(400).json({
        status: "error",
        message: "Password tidak sesuai",
      });
    }

    const result = await prisma.akun.update({
      where: {
        USERNAME: newData.username,
      },
      data: {
        PASSWORD: await encryptPassword(newData.newPassword),
      },
    });

    res.status(200).json({
      status: "success",
      message: `Berhasil mengupdate data akun ${newData.username}`,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: `Internal server error
      Trace: ${err.message}`,
    });
  }
};

const editProfile = async (req, res) => {
  const username = req.currentUser.USERNAME;
  const newData = req.body;

  try {
    const findUser = await prisma.akun.findFirst({
      where: {
        USERNAME: username,
      },
      include: {
        customer: true,
      },
    });

    if (!findUser) {
      return res.status(404).json({
        status: "error",
        message: `User dengan username ${username} tidak ditemukan`,
      });
    }

    const result = await prisma.customer.update({
      where: {
        ID_CUSTOMER: findUser.customer[0].ID_CUSTOMER,
      },

      data: {
        NAMA_CUSTOMER: newData.NAMA_CUSTOMER,
        NAMA_INSTITUSI: newData.NAMA_INSTITUSI,
        ALAMAT: newData.ALAMAT,
        NO_TELP: newData.NO_TELP,
        EMAIL: newData.EMAIL,
      },
    });

    res.status(200).json({
      status: "success",
      message: `Berhasil mengupdate data profile ${username}`,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: `Internal server error
      Trace: ${err.message}`,
    });
  }
};

const editProfileMobile = async (req, res) => {
  const username = req.body.USERNAME;
  const newData = req.body;

  try {
    const findUser = await prisma.akun.findFirst({
      where: {
        USERNAME: username,
      },
      include: {
        customer: true,
      },
    });

    if (!findUser) {
      return res.status(404).json({
        status: "error",
        message: `User dengan username ${username} tidak ditemukan`,
      });
    }

    const result = await prisma.customer.update({
      where: {
        ID_CUSTOMER: findUser.customer[0].ID_CUSTOMER,
      },

      data: {
        NAMA_CUSTOMER: newData.NAMA_CUSTOMER,
        NAMA_INSTITUSI: newData.NAMA_INSTITUSI,
        ALAMAT: newData.ALAMAT,
        NO_TELP: newData.NO_TELP,
        EMAIL: newData.EMAIL,
      },
    });

    res.status(200).json({
      status: "success",
      message: `Berhasil mengupdate data profile ${username}`,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: `Internal server error
      Trace: ${err.message}`,
    });
  }
};

const getRiwayatReservasi = async (req, res) => {
  const { id } = req.params;

  try {
    const customers = await prisma.customer.findMany({
      where: {
        ID_AKUN: parseInt(id),
      },
    });

    const riwayatReservasis = customers.map(async (customer) => {
      const riwayatReservasi = await prisma.reservasi.findMany({
        where: {
          ID_CUSTOMER: customer.ID_CUSTOMER,
        },
      }); 

      return riwayatReservasi
    })

    return res.status(200).json({
      status: "success",
      message: "Riwayat reservasi berhasil didapatkan",
      data: (await Promise.all(riwayatReservasis)).flat(),
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: `Internal server error
      Trace: ${err.message}`,
    });
  }
};

const getDetailRiwayatReservasi = async (req, res) => {
  const idReservasi = req.params.id;

  try {
    const detailRiwayatTransaksi = await prisma.reservasi.findFirst({
      where: {
        ID_RESERVASI: parseInt(idReservasi),
      },
      include: {
        invoice: true,
        detail_reservasi_fasilitas: {
          include: {
            fasilitas_tambahan: true,
          },
        },
        detail_reservasi_kamar: {
          include: {
            tarif: {
              include: {
                kamar: true,
                season: true,
              },
            },
          },
        },
        customer: true,
        pegawai: true,
      },
    });

    if (!detailRiwayatTransaksi) {
      return res.status(404).json({
        status: "error",
        message: "Riwayat transaksi tidak ditemukan",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Detail riwayat transaksi berhasil didapatkan",
      data: detailRiwayatTransaksi,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: `Internal server error
      Trace: ${err.message}`,
    });
  }
};

const getAllRiwayatReservasi = async (req, res) => {
  try {
    const result = await prisma.reservasi.findMany({})
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Internal server error
      Trace: ${err.message}`,
    })
  }
}

module.exports = {
  getProfileById,
  getProfile,
  editAkun,
  editAkunMobile,
  editProfile,
  editProfileMobile,
  getRiwayatReservasi,
  getDetailRiwayatReservasi,
  getAllRiwayatReservasi
};
