const prisma = require("../prisma/index");

const getLaporanCustomerBaru = async (req, res) => {
  const yearNow = new Date().getFullYear();

  try {
    const prismaResult = await prisma.customer.groupBy({
      by: ["CREATED_AT_MONTH"],
      _count: {
        ID_CUSTOMER: true,
      },
      where: {
        CREATED_AT_YEAR: yearNow.toString(),
      },
    });

    const result = {
      dataLaporan: [],
      tanggal_cetak: new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      tahun: yearNow,
      total_customer_baru: 0,
    };

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    result.dataLaporan = monthNames.map((month) => ({
      bulan: month,
      jumlah_customer: 0,
    }));

    for (let prismaRow of prismaResult) {
      const index = monthNames.indexOf(prismaRow.CREATED_AT_MONTH);
      if (index !== -1) {
        result.dataLaporan[index] = {
          bulan: monthNames[index],
          jumlah_customer: prismaRow._count.ID_CUSTOMER || 0,
        };
        result.total_customer_baru += prismaRow._count.ID_CUSTOMER;
      }
    }

    res.status(200).json({
      status: "success",
      message: "data laporan customer baru berhasil didapatkan",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `data laporan customer baru gagal didapatkan
      Trace: ${error.message}`,
    });
  }
};

const getLaporanPendapatanPerJenisTamuPerBulan = async (req, res) => {
  const yearNow = new Date().getFullYear();
  
  try {
    const prismaResult = await prisma.reservasi.groupBy({
      by: ["CREATED_AT_MONTH", "JENIS_CUSTOMER"],
      _sum: {
        TOTAL_BAYAR: true,
      },
      where: {
        CREATED_AT_YEAR: yearNow.toString(),
      },
    });

    const result = {
      dataLaporan: [],
      tanggal_cetak: new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      tahun: yearNow,
      total_pendapatan_grup: 0,
      total_pendapatan_personal: 0,
      total_pendapatan: 0,
    };

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    result.dataLaporan = monthNames.map((month) => ({
      bulan: month,
      pendapatan_grup: 0,
      pendapatan_personal: 0,
      pendapatan_per_bulan: 0,
    }));

    for (let prismaRow of prismaResult) {
      const index = monthNames.indexOf(prismaRow.CREATED_AT_MONTH);
      if (index !== -1) {
        if (prismaRow.JENIS_CUSTOMER === "Group") {
          result.dataLaporan[index] = {
            ...result.dataLaporan[index],
            pendapatan_grup: prismaRow._sum.TOTAL_BAYAR || 0,
          };
          result.total_pendapatan_grup += prismaRow._sum.TOTAL_BAYAR;
        } else {
          result.dataLaporan[index] = {
            ...result.dataLaporan[index],
            pendapatan_personal: prismaRow._sum.TOTAL_BAYAR || 0,
          };
          result.total_pendapatan_personal += prismaRow._sum.TOTAL_BAYAR;
        }
        result.dataLaporan[index] = {
          ...result.dataLaporan[index],
          pendapatan_per_bulan:
            result.dataLaporan[index].pendapatan_grup +
            result.dataLaporan[index].pendapatan_personal,
        };
      }

      result.total_pendapatan =
        result.total_pendapatan_grup + result.total_pendapatan_personal;
    }

    res.status(200).json({
      status: "success",
      message:
        "data laporan pendapatan per jenis tamu per bulan berhasil didapatkan",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `data laporan pendapatan per jenis tamu per bulan gagal didapatkan
      Trace: ${error.message}`,
    });
  }
};

const getLaporanJumlahTamuPerBulan = async (req, res) => {
  const today = new Date();
  const yearNow = today.getFullYear();
  const monthNow = today.toLocaleString("default", { month: "long" });

  try {
    const prismaResult = await prisma.$queryRaw`
      SELECT
        k.JENIS_KAMAR AS jenis_kamar,
        r.JENIS_CUSTOMER AS jenis_tamu,
        COUNT(drk.ID_DETAIL_RESERVASI_KAMAR) as jumlah_tamu
      FROM
        Detail_Reservasi_Kamar drk
        JOIN Tarif t ON drk.ID_TARIF = t.ID_TARIF
        JOIN Kamar k ON t.ID_KAMAR = k.ID_KAMAR
        JOIN Reservasi r ON drk.ID_RESERVASI = r.ID_RESERVASI
      WHERE
        r.CREATED_AT_MONTH = ${monthNow.toString()}
        AND
        r.CREATED_AT_YEAR = ${yearNow.toString()}
      GROUP BY
        k.JENIS_KAMAR, r.JENIS_CUSTOMER
    `;

    const sendResult = {
      dataLaporan: [],
      tanggal_cetak: new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      total_tamu: 0,
      bulan: monthNow,
      tahun: yearNow,
    }

    const serializedResult = prismaResult.reduce((result, entry) => {
      const jenis_kamar = entry.jenis_kamar;
      const jenis_tamu = entry.jenis_tamu;
      const jumlah_tamu = Number(entry.jumlah_tamu);

      if (!result[jenis_kamar]) {
        result[jenis_kamar] = {
          jenis_kamar,
          Group: 0,
          Personal: 0,
          Total: 0,
        };
      }

      result[jenis_kamar][jenis_tamu] = jumlah_tamu;
      result[jenis_kamar].Total += jumlah_tamu;
      sendResult.total_tamu += jumlah_tamu;
      return result;
    }, {});

    sendResult.dataLaporan = Object.values(serializedResult);

    res.status(200).json({
      status: "success",
      message: "data laporan jumlah tamu per bulan berhasil didapatkan",
      data: sendResult,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `data laporan jumlah tamu per bulan gagal didapatkan
      Trace: ${error.message}`,
    });
  }
};

const getTop5Customers = async (req, res) => {
  try {
    const prismaResult = await prisma.$queryRaw`
      SELECT
        c.ID_CUSTOMER,
        c.NAMA_CUSTOMER,
        COUNT(r.ID_RESERVASI) as jumlah_reservasi,
        SUM(r.TOTAL_BAYAR) as total_pembayaran
      FROM
        Customer c
        LEFT JOIN Reservasi r ON c.ID_CUSTOMER = r.ID_CUSTOMER
      GROUP BY
        c.ID_CUSTOMER
      ORDER BY
        jumlah_reservasi DESC
      LIMIT 5
    `;

    const result = {
      dataLaporan: [],
      tanggal_cetak: new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    }

    const formatNumber = number => new Intl.NumberFormat('en-US').format(number)

    dataLaporan = prismaResult.map(item => ({
      id_customer: item.ID_CUSTOMER,
      nama_customer: item.NAMA_CUSTOMER,
      jumlah_reservasi: formatNumber(item.jumlah_reservasi),
      total_pembayaran: formatNumber(item.total_pembayaran),
    }));

    result.dataLaporan = dataLaporan;

    res.status(200).json({
      status: 'success',
      message: 'Top 5 customers with most bookings retrieved successfully',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: `Failed to retrieve top 5 customers with most bookings.
      Trace: ${error.message}`,
    });
  }
};

module.exports = {
  getLaporanCustomerBaru,
  getLaporanPendapatanPerJenisTamuPerBulan,
  getLaporanJumlahTamuPerBulan,
  getTop5Customers
};
